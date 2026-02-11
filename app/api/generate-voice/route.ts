import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/elevenlabs";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    console.log("🔊 Voice API called");
    console.log("🔊 API Key present:", !!apiKey, apiKey ? `(${apiKey.substring(0, 10)}...)` : "");
    console.log("🔊 Voice ID:", voiceId);

    if (!apiKey) {
      console.log("🔊 ERROR: No API key found in environment");
      return NextResponse.json(
        { 
          error: "ElevenLabs API key not configured",
          message: "Voice generation is not available. Please set ELEVENLABS_API_KEY in your environment variables."
        },
        { status: 503 }
      );
    }

    const audioBuffer = await textToSpeech(text, apiKey);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("🔊 Voice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
