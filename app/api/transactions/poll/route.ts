import { NextResponse } from "next/server";
import { getRecentTrades, filterQualifyingTransactions, getSolAmount } from "@/lib/birdeye";
import { generateTransactionResponse } from "@/lib/openai";
import { textToSpeech } from "@/lib/elevenlabs";
import { eventStore, createEventId } from "@/lib/events";

// Store processed transaction hashes to avoid duplicates
const processedTxHashes = new Set<string>();

// Track the last poll time (start from 60 seconds ago)
let lastPollTime = Math.floor(Date.now() / 1000) - 60;

// Track when we last processed a transaction (for cooldown)
let lastProcessedTime = 0;
const COOLDOWN_MS = 10000; // 10 second cooldown between processing

// Minimum SOL amount to trigger Werner
const MIN_SOL_AMOUNT = 3.5;

// Clean quotes from text for voice
function cleanTextForVoice(text: string): string {
    return text
        .replace(/["""''`]/g, '')
        .replace(/[*_~]/g, '')
        .trim();
}

export async function GET() {
    try {
        const birdeyeKey = process.env.BIRDEYE_API_KEY;
        const tokenAddress = process.env.TOKEN_MINT_ADDRESS;

        // Check configuration
        if (!birdeyeKey || birdeyeKey === "your_birdeye_api_key_here") {
            return NextResponse.json({ error: "Birdeye API key not configured" }, { status: 503 });
        }

        if (!tokenAddress || tokenAddress === "your_token_mint_address_here") {
            return NextResponse.json({ error: "Token address not configured" }, { status: 503 });
        }

        // Fetch recent trades from Birdeye
        console.log("📊 Polling Birdeye for transactions since:", lastPollTime);
        const trades = await getRecentTrades(tokenAddress, birdeyeKey, lastPollTime, 20);

        // Update last poll time for next request
        lastPollTime = Math.floor(Date.now() / 1000);

        // Filter for qualifying buys (2+ SOL)
        const qualifyingTrades = filterQualifyingTransactions(trades, MIN_SOL_AMOUNT);
        console.log(`📊 Found ${trades.length} trades, ${qualifyingTrades.length} qualifying (${MIN_SOL_AMOUNT}+ SOL)`);

        // Find NEW transactions we haven't processed
        const newTrades = qualifyingTrades.filter(tx => !processedTxHashes.has(tx.txHash));

        if (newTrades.length === 0) {
            return NextResponse.json({ success: true, processed: 0, total: trades.length });
        }

        // Check cooldown - don't process if we recently processed one
        const now = Date.now();
        if (now - lastProcessedTime < COOLDOWN_MS) {
            // Mark all new trades as processed so we don't pick them up later
            newTrades.forEach(t => processedTxHashes.add(t.txHash));
            console.log(`🚫 Cooldown active, skipping ${newTrades.length} trades`);
            return NextResponse.json({ success: true, processed: 0, cooldown: true, skipped: newTrades.length });
        }

        // Process only the FIRST new trade (one at a time)
        const tx = newTrades[0];
        processedTxHashes.add(tx.txHash);
        lastProcessedTime = now;

        // Also mark other new trades as processed so we skip them
        newTrades.slice(1).forEach(t => {
            processedTxHashes.add(t.txHash);
            console.log(`🚫 Skipping additional tx: ${getSolAmount(t).toFixed(2)} SOL`);
        });

        // Clean up old hashes (keep max 500)
        if (processedTxHashes.size > 500) {
            const hashes = Array.from(processedTxHashes);
            hashes.slice(0, 250).forEach(h => processedTxHashes.delete(h));
        }

        const solAmount = getSolAmount(tx);
        console.log(`🎬 Processing: ${solAmount.toFixed(2)} SOL from ${tx.owner.slice(0, 8)}...`);

        // Generate Werner's response
        const openaiKey = process.env.OPENAI_API_KEY;
        const elevenlabsKey = process.env.ELEVENLABS_API_KEY;

        let responseText = "Another soul ventures into the abyss. How very human.";
        let audioBase64: string | undefined;

        // Generate AI response
        if (openaiKey) {
            try {
                const chatResponse = await generateTransactionResponse(solAmount, openaiKey);
                responseText = chatResponse.text;
                console.log(`🎤 Werner: "${responseText}"`);
            } catch (error) {
                console.error("OpenAI error:", error);
            }
        }

        // Generate voice audio
        if (elevenlabsKey) {
            try {
                const voiceText = cleanTextForVoice(responseText);
                const audioBuffer = await textToSpeech(voiceText, elevenlabsKey);
                audioBase64 = Buffer.from(audioBuffer).toString("base64");
                console.log(`🔊 Voice generated (${audioBuffer.byteLength} bytes)`);
            } catch (error) {
                console.error("ElevenLabs error:", error);
            }
        }

        // Push event to SSE subscribers
        const eventData = {
            id: createEventId(),
            type: "response" as const,
            data: {
                solAmount,
                walletAddress: tx.owner,
                responseText,
                audioUrl: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : undefined,
                timestamp: Date.now(),
            },
        };

        eventStore.addEvent(eventData);
        console.log(`📡 Event pushed to SSE`);

        return NextResponse.json({
            success: true,
            processed: 1,
            skipped: newTrades.length - 1,
            total: trades.length,
        });

    } catch (error) {
        console.error("Polling error:", error);
        return NextResponse.json(
            { error: "Poll failed", message: String(error) },
            { status: 500 }
        );
    }
}
