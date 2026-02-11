import { NextResponse } from "next/server";
import { getRecentTrades, filterQualifyingTransactions, getSolAmount } from "@/lib/birdeye";
import { generateTransactionResponse } from "@/lib/openai";
import { textToSpeech } from "@/lib/elevenlabs";
import { eventStore, createEventId } from "@/lib/events";

// Store processed transaction hashes to avoid duplicates
const processedTxs = new Set<string>();
const MAX_PROCESSED_TXS = 1000;

// Track the last poll time
let lastPollTime = Math.floor(Date.now() / 1000) - 60; // Start from 1 minute ago

// Minimum SOL amount to trigger Werner
const MIN_SOL_AMOUNT = 4;

export async function GET() {
  try {
    const birdeyeKey = process.env.BIRDEYE_API_KEY;
    const tokenAddress = process.env.TOKEN_MINT_ADDRESS;

    if (!birdeyeKey || birdeyeKey === "your_birdeye_api_key_here") {
      return NextResponse.json(
        { error: "Birdeye API key not configured", configured: false },
        { status: 503 }
      );
    }

    if (!tokenAddress || tokenAddress === "your_token_mint_address_here") {
      return NextResponse.json(
        { error: "Token mint address not configured", configured: false },
        { status: 503 }
      );
    }

    // Fetch recent trades from Birdeye since last poll
    const trades = await getRecentTrades(tokenAddress, birdeyeKey, lastPollTime, 20);
    
    // Update last poll time
    lastPollTime = Math.floor(Date.now() / 1000);
    
    // Filter for qualifying transactions (4+ SOL buys)
    const qualifyingTrades = filterQualifyingTransactions(trades, MIN_SOL_AMOUNT);

    // Process new transactions
    const newTrades = qualifyingTrades.filter((tx) => !processedTxs.has(tx.txHash));

    for (const tx of newTrades) {
      // Mark as processed
      processedTxs.add(tx.txHash);

      // Clean up old entries if set gets too large
      if (processedTxs.size > MAX_PROCESSED_TXS) {
        const entries = Array.from(processedTxs);
        entries.slice(0, 500).forEach((hash) => processedTxs.delete(hash));
      }

      const solAmount = getSolAmount(tx);
      console.log(`🎬 New qualifying transaction: ${solAmount.toFixed(2)} SOL from ${tx.owner}`);

      // Generate Werner's response
      const openaiKey = process.env.OPENAI_API_KEY;
      const elevenlabsKey = process.env.ELEVENLABS_API_KEY;

      let responseText = "Another soul ventures into the abyss of speculation. How very human.";
      let audioBase64: string | undefined;

      if (openaiKey) {
        try {
          const chatResponse = await generateTransactionResponse(solAmount, openaiKey);
          responseText = chatResponse.text;
          console.log(`🎤 Werner says: "${responseText}"`);
        } catch (error) {
          console.error("Failed to generate chat response:", error);
        }
      }

      // Generate voice audio
      if (elevenlabsKey) {
        try {
          const audioBuffer = await textToSpeech(responseText, elevenlabsKey);
          audioBase64 = Buffer.from(audioBuffer).toString("base64");
          console.log(`🔊 Voice generated successfully`);
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
          walletAddress: tx.owner,
          responseText,
          audioUrl: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : undefined,
          timestamp: Date.now(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      processed: newTrades.length,
      totalQualifying: qualifyingTrades.length,
      totalTrades: trades.length,
    });
  } catch (error) {
    console.error("Transaction polling error:", error);
    return NextResponse.json(
      { error: "Failed to poll transactions", message: String(error) },
      { status: 500 }
    );
  }
}
