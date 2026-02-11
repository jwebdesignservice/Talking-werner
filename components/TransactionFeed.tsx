"use client";

import { useState, useEffect, useCallback } from "react";
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

    // Listen for transaction events
    const handleWernerEvent = useCallback((event: WernerEventData) => {
        if (event.type === "response" && event.data.solAmount) {
            const newTx: Transaction = {
                id: `tx-${Date.now()}`,
                amount: event.data.solAmount,
                wallet: event.data.walletAddress || "unknown",
                timestamp: event.data.timestamp || Date.now(),
            };

            setLatestTx(newTx);

            setTransactions((prev) => {
                const updated = [newTx, ...prev].slice(0, 10); // Keep last 10
                return updated;
            });
        }
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
        <div className="card-matrix p-3 md:p-4 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--matrix-green-dark)]">
                <span className="w-2 h-2 bg-[var(--matrix-green)] rounded-full animate-pulse" />
                <h3 className="text-[var(--matrix-green)] text-xs font-mono uppercase tracking-wider">
                    Live Buys
                </h3>
                <span className="text-[var(--matrix-green-dim)] text-xs font-mono ml-auto">
                    7+ SOL
                </span>
            </div>

            {/* Transaction list */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                {transactions.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-[var(--matrix-green-dim)] text-xs font-mono">
                            &gt; AWAITING_TRANSACTIONS...
                        </p>
                        <p className="text-[var(--text-muted)] text-[10px] font-mono mt-1">
                            Monitoring for 7+ SOL buys
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
                <div className="mt-3 pt-2 border-t border-[var(--matrix-green-dark)] flex justify-between">
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
