"use client";

import { useState, useEffect, useMemo } from "react";

interface PreloaderProps {
    onLoadComplete: () => void;
}

interface RainColumn {
    top: number;
    delay: number;
    opacity: number;
    chars: string[];
}

export default function Preloader({ onLoadComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("INITIALIZING NEURAL LINK");
    const [glitchText, setGlitchText] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Generate rain data only on client after mount to avoid hydration mismatch
    const [rainData, setRainData] = useState<RainColumn[]>([]);

    const loadingMessages = [
        "INITIALIZING NEURAL LINK",
        "CONNECTING TO THE VOID",
        "LOADING PENGUIN CONSCIOUSNESS",
        "CALIBRATING EXISTENTIAL DREAD",
        "DOWNLOADING HERZOG WISDOM",
        "ESTABLISHING ABYSS CONNECTION",
        "RENDERING FROZEN WILDERNESS",
        "AWAKENING WERNER",
    ];

    // Generate rain data only on client side to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        const columns: RainColumn[] = [...Array(20)].map(() => ({
            top: Math.random() * 100,
            delay: Math.random() * 2,
            opacity: Math.random() * 0.5 + 0.2,
            chars: [...Array(20)].map(() => Math.random() > 0.5 ? "1" : "0"),
        }));
        setRainData(columns);
    }, []);

    useEffect(() => {
        // Minimum display time of 3 seconds
        const minDisplayTime = 3000;
        const startTime = Date.now();

        // Simulate loading progress - slower increments
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    // Ensure minimum display time has passed
                    const elapsed = Date.now() - startTime;
                    const remainingTime = Math.max(0, minDisplayTime - elapsed);
                    setTimeout(() => onLoadComplete(), remainingTime + 500);
                    return 100;
                }
                // Slower, more gradual increment
                const increment = Math.random() * 8 + 2;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        // Change loading text periodically
        let messageIndex = 0;
        const textInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingText(loadingMessages[messageIndex]);
            // Trigger glitch effect
            setGlitchText(true);
            setTimeout(() => setGlitchText(false), 150);
        }, 400);

        return () => {
            clearInterval(progressInterval);
            clearInterval(textInterval);
        };
    }, [onLoadComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
            {/* Matrix rain effect in background - only render after mount to avoid hydration mismatch */}
            {mounted && rainData.length > 0 && (
                <div className="absolute inset-0 opacity-20">
                    {rainData.map((column, i) => (
                        <div
                            key={i}
                            className="absolute text-[var(--matrix-green)] text-xs font-mono animate-pulse"
                            style={{
                                left: `${i * 5}%`,
                                top: `${column.top}%`,
                                animationDelay: `${column.delay}s`,
                                opacity: column.opacity,
                            }}
                        >
                            {column.chars.map((char, j) => (
                                <div key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                                    {char}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Penguin silhouette */}
            <div className="relative mb-8">
                {/* Glow effect */}
                <div
                    className="absolute inset-0 blur-3xl opacity-50"
                    style={{
                        background: "radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 70%)",
                        transform: "scale(2)",
                    }}
                />

                {/* Penguin image with green tint */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[var(--matrix-green)] shadow-[0_0_30px_rgba(0,255,0,0.5)]">
                    <img
                        src="/Penguin bg.jpg"
                        alt="Loading..."
                        className="w-full h-full object-cover"
                        style={{
                            filter: "grayscale(100%) brightness(0.8) sepia(100%) hue-rotate(70deg) saturate(3)",
                        }}
                    />
                    {/* Scanline overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)",
                        }}
                    />
                    {/* Pulsing overlay */}
                    <div className="absolute inset-0 bg-[rgba(0,255,0,0.1)] animate-pulse" />
                </div>
            </div>

            {/* Title */}
            <h1
                className={`font-['Orbitron'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--matrix-green)] mb-2 tracking-tight ${glitchText ? "animate-pulse" : ""}`}
                style={{
                    textShadow: "0 0 10px rgba(0,255,0,0.8), 0 0 20px rgba(0,255,0,0.5), 0 0 40px rgba(0,255,0,0.3)",
                }}
            >
                EXISTENTIAL FINANCE
            </h1>

            {/* Subtitle */}
            <p className="text-[var(--matrix-green-dim)] font-mono text-sm mb-8 opacity-70">
        // The void awaits your presence
            </p>

            {/* Loading bar container */}
            <div className="w-64 md:w-96 mb-4">
                {/* Loading text */}
                <div className="flex justify-between items-center mb-2">
                    <span
                        className={`text-[var(--matrix-green)] font-mono text-xs tracking-widest ${glitchText ? "opacity-50" : "opacity-100"}`}
                        style={{
                            transition: "opacity 0.1s",
                        }}
                    >
                        {loadingText}
                    </span>
                    <span className="text-[var(--matrix-green)] font-mono text-xs">
                        {Math.floor(progress)}%
                    </span>
                </div>

                {/* Progress bar background */}
                <div className="h-2 bg-[rgba(0,255,0,0.1)] border border-[var(--matrix-green-dim)] relative overflow-hidden">
                    {/* Progress bar fill */}
                    <div
                        className="h-full bg-[var(--matrix-green)] relative transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shimmer effect */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                animation: "shimmer 1s infinite",
                            }}
                        />
                    </div>

                    {/* Glowing edge */}
                    <div
                        className="absolute top-0 bottom-0 w-2 bg-white blur-sm"
                        style={{
                            left: `${progress}%`,
                            transform: "translateX(-50%)",
                            opacity: progress < 100 ? 0.8 : 0,
                        }}
                    />
                </div>

                {/* Progress bar segments */}
                <div className="flex justify-between mt-1">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 h-1 ${progress >= (i + 1) * 10 ? "bg-[var(--matrix-green)]" : "bg-[var(--matrix-green-dim)]"}`}
                            style={{
                                boxShadow: progress >= (i + 1) * 10 ? "0 0 5px rgba(0,255,0,0.8)" : "none",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Terminal-style loading details */}
            <div className="font-mono text-xs text-[var(--text-muted)] mt-4 text-center max-w-md px-4">
                <p className="animate-pulse">&gt; establishing connection to blockchain_</p>
            </div>

            {/* CSS for shimmer animation */}
            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
}
