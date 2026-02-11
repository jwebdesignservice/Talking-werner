"use client";

import { useState, useCallback, useRef } from "react";
import { useVoicePlayer, useWernerEvents, WernerEventData } from "@/hooks/useVoicePlayer";
import { useTransactionPoller } from "@/hooks/useTransactionPoller";

export default function WernerPortrait() {
    const [inputValue, setInputValue] = useState("");
    const [response, setResponse] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<{ amount: number; wallet: string } | null>(null);

    // Use ref to track GIF element for animation reset
    const gifRef = useRef<HTMLImageElement>(null);

    // Voice player with callbacks for synchronization
    const { state: voiceState, play, generateAndPlay } = useVoicePlayer({
        onStart: () => {
            console.log("🎬 WernerPortrait: onStart callback triggered - showing GIF");
            setIsTalking(true);
            // Force GIF to restart by resetting src
            if (gifRef.current) {
                console.log("🎬 Restarting GIF animation");
                const src = gifRef.current.src;
                gifRef.current.src = "";
                setTimeout(() => {
                    if (gifRef.current) gifRef.current.src = src;
                }, 10);
            }
        },
        onEnd: () => {
            console.log("🎬 WernerPortrait: onEnd callback triggered - hiding GIF");
            setIsTalking(false);
        },
        onError: (error) => {
            console.error("🎬 WernerPortrait: onError callback triggered:", error);
            setIsTalking(false);
        },
    });

    // Poll Birdeye for transactions every 10 seconds
    useTransactionPoller({ interval: 10000, enabled: true });

    // Listen for SSE events from Solana transactions
    const handleWernerEvent = useCallback((event: WernerEventData) => {
        if (event.type === "response" && event.data.responseText) {
            setResponse(event.data.responseText);
            setLastTransaction({
                amount: event.data.solAmount || 0,
                wallet: event.data.walletAddress || "unknown",
            });

            // Play the audio if available
            if (event.data.audioUrl) {
                play(event.data.audioUrl);
            } else {
                generateAndPlay(event.data.responseText);
            }
        }
    }, [play, generateAndPlay]);

    useWernerEvents(handleWernerEvent);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isThinking) return;

        setIsThinking(true);
        setResponse("");
        setIsTalking(false);

        try {
            // Call the chat API for an intelligent response
            const chatResponse = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputValue }),
            });

            const data = await chatResponse.json();
            const responseText = data.text || "The void offers no response today.";

            setResponse(responseText);
            setIsThinking(false);

            // Generate and play the voice - this will trigger onStart/onEnd callbacks
            await generateAndPlay(responseText);
        } catch (error) {
            console.error("Failed to get response:", error);
            setResponse("The connection to the abyss has been severed. Try again.");
            setIsThinking(false);
        } finally {
            setInputValue("");
        }
    }, [inputValue, isThinking, generateAndPlay]);

    return (
        <div className="animate-fade-in animate-delay-2 h-full">
            {/* Main card with Matrix effect */}
            <div className="card-matrix corner-br p-4 md:p-6 h-full flex flex-col relative">

                {/* Speech bubble response - positioned above the portrait */}
                {(isThinking || response) && (
                    <div className="absolute -top-4 left-4 right-4 z-40 transform -translate-y-full">
                        <div className="bg-[rgba(0,20,0,0.95)] border-2 border-[var(--matrix-green)] p-4 relative">
                            {isThinking ? (
                                <div className="flex items-center justify-center gap-3 text-[var(--text-muted)] font-mono">
                                    <span className="text-sm">&gt; PROCESSING</span>
                                    <span className="animate-pulse">_</span>
                                </div>
                            ) : response ? (
                                <p className={`text-[var(--matrix-green)] text-sm leading-relaxed font-mono ${isTalking ? "animate-pulse" : ""}`}>
                                    &gt; &quot;{response}&quot;
                                </p>
                            ) : null}
                            {/* Speech bubble arrow */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[var(--matrix-green)]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Werner portrait - fixed height container */}
                <div className="relative w-full flex-1 min-h-[300px] overflow-hidden mb-4 border-2 border-[var(--matrix-green)]">
                    {/* Green tint overlay for Matrix effect - fixed size */}
                    <div className="absolute inset-0 bg-[rgba(0,50,0,0.3)] mix-blend-multiply z-10 pointer-events-none" />

                    {/* Static image (shown when not talking) */}
                    <img
                        src="/werner image.jpg"
                        alt="Werner Herzog"
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-200 ${isTalking ? "opacity-0" : "opacity-100"}`}
                        style={{ filter: 'grayscale(100%) brightness(0.9) contrast(1.1) sepia(100%) hue-rotate(70deg) saturate(3)' }}
                    />
                    {/* Animated GIF (shown when talking) */}
                    <img
                        ref={gifRef}
                        src="/werner-talking.gif"
                        alt="Werner Herzog Speaking"
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-200 ${isTalking ? "opacity-100" : "opacity-0"}`}
                        style={{ filter: 'grayscale(100%) brightness(0.9) contrast(1.1) sepia(100%) hue-rotate(70deg) saturate(3)' }}
                    />

                    {/* Scanline effect */}
                    <div className="absolute inset-0 z-20 pointer-events-none" style={{
                        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)'
                    }} />

                    {/* Transaction notification overlay */}
                    {lastTransaction && isTalking && (
                        <div className="absolute top-2 left-2 right-2 z-30 bg-[rgba(0,20,0,0.9)] border border-[var(--matrix-green)] px-3 py-2 text-xs font-mono">
                            <span className="text-[var(--matrix-green-dim)]">&gt; NEW_TX:</span>{" "}
                            <span className="text-[var(--matrix-green)]">{lastTransaction.amount.toFixed(2)} SOL</span>
                        </div>
                    )}

                    {/* Status indicator */}
                    {(voiceState.isLoading || isThinking) && (
                        <div className="absolute bottom-2 right-2 z-30 bg-[rgba(0,20,0,0.9)] border border-[var(--matrix-green)] px-3 py-1">
                            <span className="text-xs text-[var(--matrix-green)] animate-pulse font-mono">
                                {isThinking ? "THINKING..." : "GENERATING_VOICE..."}
                            </span>
                        </div>
                    )}

                    {/* Playing indicator */}
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
                        disabled={isThinking || voiceState.isLoading || isTalking}
                    />
                    <button
                        type="submit"
                        className="btn-matrix-filled w-full"
                        disabled={isThinking || !inputValue.trim() || voiceState.isLoading || isTalking}
                    >
                        {isThinking ? "Processing..." : voiceState.isLoading ? "Generating..." : isTalking ? "Speaking..." : "Seek Guidance"}
                    </button>
                </form>

                {/* Observation note */}
                <p className="text-[var(--text-muted)] text-xs text-center mt-3 font-mono">
                    // Voice triggers on tx ≥ 4 SOL
                </p>
            </div>
        </div>
    );
}
