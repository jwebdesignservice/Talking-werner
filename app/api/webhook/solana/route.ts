import { NextRequest, NextResponse } from "next/server";
import { generateTransactionResponse } from "@/lib/openai";
import { textToSpeech } from "@/lib/elevenlabs";
import { eventStore, createEventId } from "@/lib/events";
import crypto from "crypto";

// Minimum SOL amount to trigger Werner
const MIN_SOL_AMOUNT = 4;

// Verify Helius webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-helius-signature") || "";
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const data = JSON.parse(payload);
    
    // Handle Helius webhook format
    // Helius sends an array of transactions
    const transactions = Array.isArray(data) ? data : [data];

    for (const tx of transactions) {
      // Extract SOL amount from the transaction
      // This depends on your specific token and transaction structure
      const solAmount = extractSolAmount(tx);

      if (solAmount >= MIN_SOL_AMOUNT) {
        console.log(`Qualifying transaction detected: ${solAmount} SOL`);

        // Generate Werner's response
        const openaiKey = process.env.OPENAI_API_KEY;
        const elevenlabsKey = process.env.ELEVENLABS_API_KEY;

        let responseText = "Another soul ventures into the abyss of speculation. How very human.";
        let audioBase64: string | undefined;

        if (openaiKey) {
          try {
            const chatResponse = await generateTransactionResponse(solAmount, openaiKey);
            responseText = chatResponse.text;
          } catch (error) {
            console.error("Failed to generate chat response:", error);
          }
        }

        // Generate voice audio
        if (elevenlabsKey) {
          try {
            const audioBuffer = await textToSpeech(responseText, elevenlabsKey);
            audioBase64 = Buffer.from(audioBuffer).toString("base64");
          } catch (error) {
            console.error("Failed to generate voice:", error);
          }
        }

        // Emit event for SSE subscribers
        eventStore.addEvent({
          id: createEventId(),
          type: "response",
          data: {
            solAmount,
            walletAddress: tx.feePayer || tx.source || "unknown",
            responseText,
            audioUrl: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : undefined,
            timestamp: Date.now(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Extract SOL amount from transaction
// Adjust this based on your specific token structure
function extractSolAmount(tx: Record<string, unknown>): number {
  try {
    // Helius enhanced transaction format
    if (tx.nativeTransfers && Array.isArray(tx.nativeTransfers)) {
      const transfers = tx.nativeTransfers as Array<{ amount?: number }>;
      const totalLamports = transfers.reduce(
        (sum: number, transfer) => sum + (transfer.amount || 0),
        0
      );
      return totalLamports / 1_000_000_000; // Convert lamports to SOL
    }

    // Alternative: check for swap events
    if (tx.events && typeof tx.events === "object") {
      const events = tx.events as { swap?: { nativeInput?: { amount?: number } } };
      if (events.swap?.nativeInput?.amount) {
        return events.swap.nativeInput.amount / 1_000_000_000;
      }
    }

    // Fallback: check raw transaction amount
    if (typeof tx.amount === "number") {
      return tx.amount / 1_000_000_000;
    }

    return 0;
  } catch {
    return 0;
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Werner webhook endpoint is ready",
    minSolAmount: MIN_SOL_AMOUNT,
  });
}
