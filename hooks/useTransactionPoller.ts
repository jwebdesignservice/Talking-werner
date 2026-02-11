"use client";

import { useEffect, useRef } from "react";

interface UseTransactionPollerOptions {
  interval?: number; // Polling interval in milliseconds
  enabled?: boolean;
}

export function useTransactionPoller({
  interval = 10000, // Default: poll every 10 seconds
  enabled = true,
}: UseTransactionPollerOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const pollTransactions = async () => {
      try {
        const response = await fetch("/api/transactions/poll");
        const data = await response.json();
        
        // 503 means API not configured yet - silently ignore
        if (response.status === 503) {
          return;
        }
        
        if (!response.ok) {
          console.error("Polling failed:", response.status, data.error);
          return;
        }
        
        if (data.processed > 0) {
          console.log(`🎬 Processed ${data.processed} new qualifying transactions`);
        }
      } catch (error) {
        // Network errors - silently ignore to avoid console spam
      }
    };

    // Initial poll
    pollTransactions();

    // Set up interval
    intervalRef.current = setInterval(pollTransactions, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, enabled]);
}
