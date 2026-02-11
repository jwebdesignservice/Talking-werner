"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface VoicePlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
}

export interface UseVoicePlayerOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface UseVoicePlayerReturn {
  state: VoicePlayerState;
  play: (audioSource: string) => Promise<void>;
  stop: () => void;
  generateAndPlay: (text: string) => Promise<void>;
  simulateVoice: (durationMs: number) => void;
}

export function useVoicePlayer(options: UseVoicePlayerOptions = {}): UseVoicePlayerReturn {
  const { onStart, onEnd, onError } = options;
  
  const [state, setState] = useState<VoicePlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
      simulationTimeoutRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  // Simulate voice for testing when ElevenLabs isn't configured
  const simulateVoice = useCallback((durationMs: number) => {
    console.log("🔊 Simulating voice for", durationMs, "ms (no ElevenLabs API key)");
    stop();
    
    setState((prev) => ({ ...prev, isPlaying: true, duration: durationMs / 1000 }));
    console.log("🎬 Calling onStart callback");
    onStart?.();
    
    simulationTimeoutRef.current = setTimeout(() => {
      console.log("🎬 Simulation complete, calling onEnd");
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
      onEnd?.();
    }, durationMs);
  }, [stop, onStart, onEnd]);

  const play = useCallback(async (audioSource: string) => {
    try {
      stop();
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const audio = new Audio(audioSource);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setState((prev) => ({
          ...prev,
          duration: audio.duration,
        }));
      });

      audio.addEventListener("timeupdate", () => {
        setState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
        }));
      });

      audio.addEventListener("ended", () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
        }));
        onEnd?.();
      });

      audio.addEventListener("error", () => {
        const errorMsg = "Failed to play audio";
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: errorMsg,
        }));
        onError?.(errorMsg);
      });

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => resolve(), { once: true });
        audio.addEventListener("error", () => reject(new Error("Audio load failed")), { once: true });
        audio.load();
      });

      setState((prev) => ({ ...prev, isLoading: false, isPlaying: true }));
      onStart?.();
      
      await audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      const errorMsg = error instanceof Error ? error.message : "Playback failed";
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: errorMsg,
      }));
      onError?.(errorMsg);
    }
  }, [stop, onStart, onEnd, onError]);

  const generateAndPlay = useCallback(async (text: string) => {
    console.log("🎙️ generateAndPlay called with text:", text.substring(0, 50) + "...");
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      console.log("🎙️ Voice API response status:", response.status);

      // If voice generation fails (503 = not configured), use fallback simulation
      if (response.status === 503) {
        console.log("🎙️ Voice API not configured (503), using fallback simulation");
        setState((prev) => ({ ...prev, isLoading: false }));
        // Simulate voice duration based on text length (~100ms per word)
        const wordCount = text.split(/\s+/).length;
        const estimatedDuration = Math.max(3000, wordCount * 350); // Min 3 seconds
        simulateVoice(estimatedDuration);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate voice");
      }

      console.log("🎙️ Voice API success, creating audio blob");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      await play(audioUrl);

      if (audioRef.current) {
        audioRef.current.addEventListener("ended", () => {
          URL.revokeObjectURL(audioUrl);
        }, { once: true });
      }
    } catch (error) {
      console.error("🎙️ Voice generation error:", error);
      // Fallback to simulation on any error
      setState((prev) => ({ ...prev, isLoading: false }));
      const wordCount = text.split(/\s+/).length;
      const estimatedDuration = Math.max(3000, wordCount * 350);
      console.log("🎙️ Falling back to simulation due to error");
      simulateVoice(estimatedDuration);
    }
  }, [play, simulateVoice]);

  return {
    state,
    play,
    stop,
    generateAndPlay,
    simulateVoice,
  };
}

// Hook to listen for Werner events via SSE
export function useWernerEvents(onEvent: (event: WernerEventData) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/events");
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "response") {
          onEvent(data);
        }
      } catch (error) {
        console.error("Failed to parse SSE event:", error);
      }
    };

    eventSource.onerror = () => {
      // Silently handle - EventSource will auto-reconnect
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onEvent]);
}

export interface WernerEventData {
  id: string;
  type: "response";
  data: {
    solAmount?: number;
    walletAddress?: string;
    responseText?: string;
    audioUrl?: string;
    timestamp: number;
  };
}
