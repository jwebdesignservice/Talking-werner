"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useVoicePlayer, useWernerEvents, WernerEventData } from "@/hooks/useVoicePlayer";
import { useTransactionPoller } from "@/hooks/useTransactionPoller";
import { useWernerBusy } from "@/contexts/WernerContext";

export default function WernerPortrait() {
    const [inputValue, setInputValue] = useState("");
    const [response, setResponse] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<{ amount: number; wallet: string } | null>(null);

    // Shared busy state
    const { setIsBusy } = useWernerBusy();

    // Refs
    const typewriterRef = useRef<NodeJS.Timeout | null>(null);
    const pendingResponse = useRef<string>("");
    const gifRef = useRef<HTMLImageElement>(null);
    const isBusyRef = useRef(false);
    const processedEventsRef = useRef<Set<string>>(new Set());
    const lastEventTimeRef = useRef<number>(0);

    // Update shared busy state
    useEffect(() => {
        setIsBusy(isThinking || isTalking);
    }, [isThinking, isTalking, setIsBusy]);

    // Typewriter effect
    useEffect(() => {
        if (isTalking && pendingResponse.current) {
            if (typewriterRef.current) clearInterval(typewriterRef.current);

            const text = pendingResponse.current;
            setDisplayedText("");
            let i = 0;

            typewriterRef.current = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                } else {
                    if (typewriterRef.current) clearInterval(typewriterRef.current);
                }
            }, 50);
        }

        return () => {
            if (typewriterRef.current) clearInterval(typewriterRef.current);
        };
    }, [isTalking]);

    // Voice player
    const { state: voiceState, play, generateAndPlay } = useVoicePlayer({
        onStart: () => {
            console.log("🎬 Voice started - showing GIF");
            setIsTalking(true);
            // Restart GIF
            if (gifRef.current) {
                const src = gifRef.current.src;
                gifRef.current.src = "";
                setTimeout(() => { if (gifRef.current) gifRef.current.src = src; }, 10);
            }
        },
        onEnd: () => {
            console.log("🎬 Voice ended - hiding GIF");
            setIsTalking(false);
            isBusyRef.current = false;
        },
    });

    // Poll for transactions (pause while busy)
    const isBusy = isThinking || voiceState.isLoading || isTalking;

    // Keep ref in sync with state
    useEffect(() => {
        isBusyRef.current = isBusy;
    }, [isBusy]);

    useTransactionPoller({ interval: 10000, enabled: !isBusy });

    // Handle SSE events
    const handleWernerEvent = useCallback((event: WernerEventData) => {
        if (!event.data?.responseText) return;

        // Create unique fingerprint for this event
        const eventId = `${event.data.timestamp}-${event.data.walletAddress}-${event.data.solAmount}`;

        // Skip duplicate events
        if (processedEventsRef.current.has(eventId)) {
            console.log("🚫 Duplicate event, skipping");
            return;
        }

        // Skip if event is too close to the last one (within 5 seconds)
        const now = Date.now();
        if (now - lastEventTimeRef.current < 5000) {
            console.log("🚫 Event too soon after last one, skipping");
            return;
        }

        // Skip if busy (use ref to avoid stale closure)
        if (isBusyRef.current) {
            console.log("🚫 Skipping - Werner is busy");
            return;
        }

        // Mark as processed and busy
        processedEventsRef.current.add(eventId);
        lastEventTimeRef.current = now;
        isBusyRef.current = true;

        // Keep set small
        if (processedEventsRef.current.size > 50) {
            const entries = Array.from(processedEventsRef.current);
            entries.slice(0, 25).forEach(e => processedEventsRef.current.delete(e));
        }

        console.log("✅ Playing:", event.data.solAmount?.toFixed(2), "SOL");

        pendingResponse.current = event.data.responseText;
        setResponse(event.data.responseText);
        setLastTransaction({
            amount: event.data.solAmount || 0,
            wallet: event.data.walletAddress || "unknown",
        });

        if (event.data.audioUrl) {
            play(event.data.audioUrl);
        } else {
            generateAndPlay(event.data.responseText);
        }
    }, [play, generateAndPlay]);

    useWernerEvents(handleWernerEvent);

    // Handle user input
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isBusy) return;

        setIsThinking(true);
        setResponse("");
        setDisplayedText("");
        pendingResponse.current = "";

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputValue }),
            });

            const data = await res.json();
            const text = data.text || "The void offers no response.";

            setResponse(text);
            pendingResponse.current = text;
            setIsThinking(false);

            await generateAndPlay(text);
        } catch (error) {
            console.error("Chat error:", error);
            setIsThinking(false);
        } finally {
            setInputValue("");
        }
    }, [inputValue, isBusy, generateAndPlay]);

    return (
        <div className="animate-fade-in animate-delay-2 h-full relative w-full">
            <div className="card-matrix corner-br p-4 md:p-6 h-full flex flex-col relative overflow-visible w-full">

                {/* Response overlay */}
                <div
                    className="absolute left-4 right-4 z-[9999] pointer-events-none"
                    style={{ top: '7px', minHeight: '48px' }}
                >
                    {(isThinking || displayedText) && (
                        <div className="bg-[rgba(0,15,0,0.98)] border-2 border-[var(--matrix-green)] px-4 py-3 shadow-[0_0_30px_rgba(0,255,0,0.6)]">
                            {isThinking ? (
                                <div className="flex items-center justify-center gap-2 text-[var(--matrix-green)] font-mono">
                                    <span className="text-sm">&gt; PROCESSING</span>
                                    <span className="animate-pulse">█</span>
                                </div>
                            ) : (
                                <p className="text-[var(--matrix-green)] text-sm leading-relaxed font-mono text-center">
                                    {displayedText}
                                    {isTalking && displayedText.length < response.length && (
                                        <span className="animate-pulse">█</span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Portrait container */}
                <div className="relative w-full aspect-square md:aspect-auto md:flex-1 md:min-h-[300px] overflow-hidden mb-4 border-2 border-[var(--matrix-green)]">
                    {/* Green tint */}
                    <div className="absolute inset-0 bg-[rgba(0,50,0,0.15)] mix-blend-multiply z-10 pointer-events-none" />

                    {/* Static image */}
                    <img
                        src="/werner image.jpg"
                        alt="Werner Herzog"
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-200 ${isTalking ? "opacity-0" : "opacity-100"}`}
                        style={{ filter: 'grayscale(100%) brightness(0.9) contrast(1.1) sepia(100%) hue-rotate(70deg) saturate(3)' }}
                    />

                    {/* Talking GIF */}
                    <img
                        ref={gifRef}
                        src="/werner-talking.gif"
                        alt="Werner Herzog Speaking"
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-200 ${isTalking ? "opacity-100" : "opacity-0"}`}
                        style={{ filter: 'grayscale(100%) brightness(0.9) contrast(1.1) sepia(100%) hue-rotate(70deg) saturate(3)' }}
                    />

                    {/* Scanlines */}
                    <div className="absolute inset-0 z-20 pointer-events-none" style={{
                        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
                    }} />

                    {/* Transaction notification */}
                    {lastTransaction && isTalking && (
                        <div className="absolute top-2 left-2 right-2 z-30 bg-[rgba(0,20,0,0.9)] border border-[var(--matrix-green)] px-3 py-2 text-xs font-mono">
                            <span className="text-[var(--matrix-green-dim)]">&gt; NEW_TX:</span>{" "}
                            <span className="text-[var(--matrix-green)]">{lastTransaction.amount.toFixed(2)} SOL</span>
                        </div>
                    )}

                    {/* Status indicators */}
                    {(voiceState.isLoading || isThinking) && (
                        <div className="absolute bottom-2 right-2 z-30 bg-[rgba(0,20,0,0.9)] border border-[var(--matrix-green)] px-3 py-1">
                            <span className="text-xs text-[var(--matrix-green)] animate-pulse font-mono">
                                {isThinking ? "THINKING..." : "GENERATING..."}
                            </span>
                        </div>
                    )}

                    {isTalking && (
                        <div className="absolute bottom-2 left-2 z-30 bg-[rgba(0,20,0,0.9)] border border-[var(--matrix-green)] px-3 py-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[var(--matrix-green)] rounded-full animate-pulse" />
                            <span className="text-xs text-[var(--matrix-green)] font-mono">SPEAKING</span>
                        </div>
                    )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSubmit} className="space-y-3 mt-auto">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Speak to the void..."
                        className="input-matrix w-full text-center"
                        disabled={isBusy}
                    />
                    <button
                        type="submit"
                        className="btn-matrix-filled w-full"
                        disabled={isBusy || !inputValue.trim()}
                    >
                        {isThinking ? "Processing..." : voiceState.isLoading ? "Generating..." : isTalking ? "Speaking..." : "Seek Guidance"}
                    </button>
                </form>

                <p className="text-[var(--text-muted)] text-xs text-center mt-3 font-mono">
                    // Voice triggers on tx ≥ 2 SOL
                </p>
            </div>
        </div>
    );
}
