import { NextRequest, NextResponse } from "next/server";
import { generateHerzogResponse } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return a fallback response if API key is not configured
      const fallbackResponses = [
        "The penguin walks not toward hope, but toward the abyss. And yet, is that not the most human thing of all?",
        "You ask about the price. But what is price, truly? It is merely the measure of collective delusion.",
        "The blockchain does not care about your hopes. It records only truth, cold and immutable as Antarctic ice.",
        "I have seen markets collapse like glaciers calving into the sea. There is a terrible beauty in it.",
        "Your question betrays a longing for certainty. But certainty, my friend, is the greatest of all illusions.",
      ];
      
      return NextResponse.json({
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        fallback: true,
      });
    }

    const response = await generateHerzogResponse(message, apiKey);

    return NextResponse.json({
      text: response.text,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Chat generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
