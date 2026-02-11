"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWernerEvents, WernerEventData } from "@/hooks/useVoicePlayer";

interface Transaction {
    id: string;
    amount: number;
    wallet: string;
    timestamp: number;
}

export default function TransactionFeed() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [latestTx, setLatestTx] = useState<Transaction | null>(null);
    
    // Track processed event fingerprints to prevent duplicates
    const processedEventsRef = useRef<Set<string>>(new Set());

    // Listen for transaction events
    const handleWernerEvent = useCallback((event: WernerEventData) => {
        if (!event.data?.solAmount) return;

        // Create fingerprint to prevent duplicates
        const fingerprint = `${event.data.timestamp}-${event.data.walletAddress}`;
        if (processedEventsRef.current.has(fingerprint)) return;
        processedEventsRef.current.add(fingerprint);

        // Keep set small
        if (processedEventsRef.current.size > 50) {
            const entries = Array.from(processedEventsRef.current);
            entries.slice(0, 25).forEach(e => processedEventsRef.current.delete(e));
        }

        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            amount: event.data.solAmount,
            wallet: event.data.walletAddress || "unknown",
            timestamp: event.data.timestamp || Date.now(),
        };

        console.log("📋 New transaction:", newTx.amount.toFixed(2), "SOL");
        setLatestTx(newTx);
        setTransactions((prev) => [newTx, ...prev].slice(0, 10));
    }, []);

    useWernerEvents(handleWernerEvent);

    // Truncate wallet address
    const truncateWallet = (wallet: string) => {
        if (wallet.length <= 10) return wallet;
        return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
    };

    // Format time ago
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    // Update times every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions((prev) => [...prev]); // Force re-render
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card-matrix p-3 md:p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--matrix-green-dark)] flex-shrink-0">
                <span className="w-2 h-2 bg-[var(--matrix-green)] rounded-full animate-pulse" />
                <h3 className="text-[var(--matrix-green)] text-xs font-mono uppercase tracking-wider">
                    Live Buys
                </h3>
                <span className="text-[var(--matrix-green-dim)] text-xs font-mono ml-auto">
                    2+ SOL
                </span>
            </div>

            {/* Transaction list - fills remaining height */}
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                {transactions.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-[var(--matrix-green-dim)] text-xs font-mono">
                            &gt; AWAITING_TRANSACTIONS...
                        </p>
                        <p className="text-[var(--text-muted)] text-[10px] font-mono mt-1">
                            Monitoring for 2+ SOL buys
                        </p>
                    </div>
                ) : (
                    transactions.map((tx, index) => (
                        <div
                            key={tx.id}
                            className={`
                                flex items-center justify-between p-2 rounded
                                border border-[var(--matrix-green-dark)]
                                ${index === 0 && latestTx?.id === tx.id
                                    ? "bg-[rgba(0,255,0,0.1)] animate-pulse border-[var(--matrix-green)]"
                                    : "bg-[rgba(0,20,0,0.5)]"
                                }
                                transition-all duration-300
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--matrix-green)] text-xs font-mono">
                                    🐧
                                </span>
                                <div>
                                    <p className="text-[var(--matrix-green)] text-xs font-mono font-bold">
                                        +{tx.amount.toFixed(2)} SOL
                                    </p>
                                    <p className="text-[var(--matrix-green-dim)] text-[10px] font-mono">
                                        {truncateWallet(tx.wallet)}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[var(--text-muted)] text-[10px] font-mono">
                                {timeAgo(tx.timestamp)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Footer stats */}
            {transactions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[var(--matrix-green-dark)] flex justify-between flex-shrink-0">
                    <span className="text-[var(--text-muted)] text-[10px] font-mono">
                        Total: {transactions.length} buys
                    </span>
                    <span className="text-[var(--matrix-green-dim)] text-[10px] font-mono">
                        {transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)} SOL
                    </span>
                </div>
            )}
        </div>
    );
}
