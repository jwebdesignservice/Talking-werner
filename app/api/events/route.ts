import { NextRequest } from "next/server";
import { eventStore, WernerEvent } from "@/lib/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Send recent events on connect
      const recentEvents = eventStore.getRecentEvents(5);
      recentEvents.forEach((event) => {
        const message = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(message));
      });

      // Subscribe to new events
      const unsubscribe = eventStore.subscribe((event: WernerEvent) => {
        try {
          const message = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch {
          // Client disconnected
          unsubscribe();
        }
      });

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          const ping = `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(ping));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 30000); // Every 30 seconds

      // Cleanup on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
