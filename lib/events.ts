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
    private instanceId = Math.random().toString(36).substring(2, 8);

    constructor() {
        console.log(`📦 EventStore instance created: ${this.instanceId}`);
    }

    addEvent(event: WernerEvent) {
        console.log(`📦 [${this.instanceId}] Adding event, ${this.listeners.size} listeners`);
        this.events.push(event);

        // Keep only the last maxEvents
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        // Notify all listeners
        this.listeners.forEach((listener) => {
            try {
                console.log(`📦 [${this.instanceId}] Notifying listener`);
                listener(event);
            } catch (error) {
                console.error("Error notifying listener:", error);
            }
        });
    }

    subscribe(listener: (event: WernerEvent) => void) {
        this.listeners.add(listener);
        console.log(`📦 [${this.instanceId}] Subscriber added, total: ${this.listeners.size}`);
        return () => {
            this.listeners.delete(listener);
            console.log(`📦 [${this.instanceId}] Subscriber removed, total: ${this.listeners.size}`);
        };
    }

    getRecentEvents(count = 10): WernerEvent[] {
        return this.events.slice(-count);
    }
}

// Use global to ensure singleton across hot reloads
const globalForEvents = globalThis as unknown as { eventStore: EventStore };

export const eventStore = globalForEvents.eventStore || new EventStore();

if (process.env.NODE_ENV !== "production") {
    globalForEvents.eventStore = eventStore;
}

// Helper to create a unique event ID
export function createEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
