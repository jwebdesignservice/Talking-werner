"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Track if user has interacted with the page
let userHasInteracted = false;

// Set up interaction listeners once
if (typeof window !== "undefined") {
    const markInteracted = () => {
        userHasInteracted = true;
        console.log("🔊 User interaction detected - audio unlocked");
    };

    ["click", "touchstart", "keydown"].forEach(event => {
        document.addEventListener(event, markInteracted, { once: true, passive: true });
    });
}

export interface VoicePlayerState {
    isPlaying: boolean;
    isLoading: boolean;
}

export interface UseVoicePlayerOptions {
    onStart?: () => void;
    onEnd?: () => void;
}

export function useVoicePlayer(options: UseVoicePlayerOptions = {}) {
    const { onStart, onEnd } = options;
    const [state, setState] = useState<VoicePlayerState>({ isPlaying: false, isLoading: false });
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const blobUrlRef = useRef<string | null>(null);

    // Cleanup blob URL
    const cleanupBlobUrl = useCallback(() => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
    }, []);

    // Stop any playing audio
    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.oncanplaythrough = null;
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current.src = "";
            audioRef.current = null;
        }
        cleanupBlobUrl();
        setState({ isPlaying: false, isLoading: false });
    }, [cleanupBlobUrl]);

    // Play audio from base64 or URL
    const play = useCallback(async (audioSource: string) => {
        console.log("🔊 play() called, source length:", audioSource?.length || 0);

        if (!audioSource || audioSource.length < 100) {
            console.log("🔊 Invalid audio source");
            onEnd?.();
            return;
        }

        stop();

        try {
            setState({ isPlaying: false, isLoading: true });

            let audioUrl = audioSource;

            // Convert base64 to blob URL for better browser support
            if (audioSource.startsWith("data:audio")) {
                try {
                    const base64 = audioSource.split(",")[1];
                    if (!base64) throw new Error("No base64 data");

                    const binary = atob(base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: "audio/mpeg" });
                    audioUrl = URL.createObjectURL(blob);
                    blobUrlRef.current = audioUrl;
                    console.log("🔊 Created blob URL, size:", blob.size, "bytes");
                } catch (e) {
                    console.error("🔊 Failed to decode base64:", e);
                    setState({ isPlaying: false, isLoading: false });
                    onEnd?.();
                    return;
                }
            }

            const audio = new Audio();
            audioRef.current = audio;

            // Set up event handlers BEFORE setting src
            audio.oncanplaythrough = () => {
                console.log("🔊 Audio ready to play");
                setState({ isPlaying: true, isLoading: false });
                onStart?.();

                const playPromise = audio.play();
                if (playPromise) {
                    playPromise.catch(err => {
                        console.error("🔊 Playback blocked:", err.message);
                        // If autoplay blocked, we still signal end so UI resets
                        setState({ isPlaying: false, isLoading: false });
                        onEnd?.();
                    });
                }
            };

            audio.onended = () => {
                console.log("🔊 Audio playback ended");
                setState({ isPlaying: false, isLoading: false });
                cleanupBlobUrl();
                onEnd?.();
            };

            audio.onerror = (e) => {
                console.error("🔊 Audio error:", audio.error?.message || "Unknown error");
                setState({ isPlaying: false, isLoading: false });
                cleanupBlobUrl();
                onEnd?.();
            };

            // Now set source and load
            audio.src = audioUrl;
            audio.load();

        } catch (error) {
            console.error("🔊 Play setup failed:", error);
            setState({ isPlaying: false, isLoading: false });
            cleanupBlobUrl();
            onEnd?.();
        }
    }, [stop, onStart, onEnd, cleanupBlobUrl]);

    // Generate voice and play
    const generateAndPlay = useCallback(async (text: string) => {
        console.log("🎙️ Generating voice for:", text.substring(0, 30) + "...");
        stop();

        try {
            setState({ isPlaying: false, isLoading: true });

            const response = await fetch("/api/generate-voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`Voice API error: ${response.status}`);
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            blobUrlRef.current = audioUrl;

            // Now play it
            const audio = new Audio();
            audioRef.current = audio;

            audio.oncanplaythrough = () => {
                console.log("🔊 Generated audio ready");
                setState({ isPlaying: true, isLoading: false });
                onStart?.();
                audio.play().catch(err => {
                    console.error("🔊 Playback blocked:", err.message);
                    setState({ isPlaying: false, isLoading: false });
                    onEnd?.();
                });
            };

            audio.onended = () => {
                console.log("🔊 Generated audio ended");
                setState({ isPlaying: false, isLoading: false });
                cleanupBlobUrl();
                onEnd?.();
            };

            audio.onerror = () => {
                console.error("🔊 Generated audio error");
                setState({ isPlaying: false, isLoading: false });
                cleanupBlobUrl();
                onEnd?.();
            };

            audio.src = audioUrl;
            audio.load();

        } catch (error) {
            console.error("🎙️ Voice generation failed:", error);
            setState({ isPlaying: false, isLoading: false });
            cleanupBlobUrl();
            onEnd?.();
        }
    }, [stop, onStart, onEnd, cleanupBlobUrl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stop();
    }, [stop]);

    return { state, play, stop, generateAndPlay };
}

// SSE Event listener hook
export interface WernerEventData {
    type: "response" | "connected" | "ping";
    data?: {
        solAmount?: number;
        walletAddress?: string;
        responseText?: string;
        audioUrl?: string;
        timestamp?: number;
    };
}

export function useWernerEvents(onEvent: (event: WernerEventData) => void) {
    const eventSourceRef = useRef<EventSource | null>(null);
    const onEventRef = useRef(onEvent);

    // Keep callback ref updated without causing reconnection
    useEffect(() => {
        onEventRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        let isMounted = true;
        let reconnectTimeout: NodeJS.Timeout | null = null;

        const connect = () => {
            if (!isMounted) return;

            // Don't reconnect if already connected
            if (eventSourceRef.current?.readyState === EventSource.OPEN) {
                return;
            }

            console.log("📡 Connecting to SSE...");
            const eventSource = new EventSource("/api/events");
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                console.log("📡 SSE connected");
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === "response") {
                        console.log("📡 SSE response event received");
                        onEventRef.current(data);
                    }
                } catch (error) {
                    console.error("📡 SSE parse error:", error);
                }
            };

            eventSource.onerror = () => {
                console.log("📡 SSE error, will reconnect in 5s...");
                eventSource.close();
                eventSourceRef.current = null;

                // Reconnect after 5 seconds
                if (isMounted) {
                    reconnectTimeout = setTimeout(connect, 5000);
                }
            };
        };

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, []); // Empty deps - only run once on mount
}
