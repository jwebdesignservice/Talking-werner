import { NextRequest } from "next/server";
import { eventStore, WernerEvent } from "@/lib/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            console.log("📡 SSE client connected");

            // Send connection confirmation
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

            // Subscribe to new events
            const unsubscribe = eventStore.subscribe((event: WernerEvent) => {
                try {
                    console.log("📡 Sending event to client:", event.type);
                    const message = `data: ${JSON.stringify(event)}\n\n`;
                    controller.enqueue(encoder.encode(message));
                } catch {
                    console.log("📡 Client disconnected");
                    unsubscribe();
                }
            });

            // Heartbeat every 30 seconds
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "ping" })}\n\n`));
                } catch {
                    clearInterval(heartbeat);
                    unsubscribe();
                }
            }, 30000);

            // Cleanup on disconnect
            request.signal.addEventListener("abort", () => {
                console.log("📡 SSE client disconnected");
                clearInterval(heartbeat);
                unsubscribe();
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
