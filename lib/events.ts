// Server-Sent Events (SSE) management for real-time Werner responses

export interface WernerEvent {
  id: string;
  type: "transaction" | "response";
  data: {
    solAmount?: number;
    walletAddress?: string;
    responseText?: string;
    audioUrl?: string;
    timestamp: number;
  };
}

// In-memory event store (for development - use Redis in production)
class EventStore {
  private events: WernerEvent[] = [];
  private listeners: Set<(event: WernerEvent) => void> = new Set();
  private maxEvents = 100;

  addEvent(event: WernerEvent) {
    this.events.push(event);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Notify all listeners
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error notifying listener:", error);
      }
    });
  }

  subscribe(listener: (event: WernerEvent) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getRecentEvents(count = 10): WernerEvent[] {
    return this.events.slice(-count);
  }
}

// Singleton instance
export const eventStore = new EventStore();

// Helper to create a unique event ID
export function createEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
