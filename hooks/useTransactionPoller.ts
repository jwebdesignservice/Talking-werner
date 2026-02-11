"use client";

import { useEffect, useRef } from "react";

interface UseTransactionPollerOptions {
    interval?: number;
    enabled?: boolean;
}

export function useTransactionPoller(options: UseTransactionPollerOptions = {}) {
    const { interval = 10000, enabled = true } = options;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const poll = async () => {
            try {
                const response = await fetch("/api/transactions/poll");
                if (response.ok) {
                    const data = await response.json();
                    if (data.processed > 0) {
                        console.log(`📊 Polled: ${data.processed} processed, ${data.skipped || 0} skipped`);
                    }
                }
            } catch (error) {
                console.error("Poll error:", error);
            }
        };

        // Initial poll
        poll();

        // Set up interval
        intervalRef.current = setInterval(poll, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [interval, enabled]);
}
