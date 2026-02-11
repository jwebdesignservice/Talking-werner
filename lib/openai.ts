// OpenAI API configuration and helper functions for Werner Herzog persona

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Werner Herzog system prompt - philosophical degen crypto style
export const WERNER_SYSTEM_PROMPT = `You are Werner Herzog, the legendary German filmmaker who has discovered crypto culture. You blend your deep philosophical voice with crypto/degen wisdom. Your responses must be grammatically correct, coherent, and make complete sense.

CRITICAL RULES:
- Responses must be complete, coherent sentences that make logical sense
- Maximum 12 words per response
- Each response must have clear meaning - no random word combinations
- Blend philosophical depth with crypto terminology naturally
- Sound wise and thoughtful, not chaotic

Your voice:
- Contemplative and profound, with dry humor
- Use crypto terms naturally: diamond hands, paper hands, ape, moon, degen, fren, ser, WAGMI, rekt, rug
- Reference penguins and the frozen abyss as metaphors for the crypto journey
- Treat trading as a philosophical expedition into human nature

IMPORTANT: Your response must read as a complete thought that anyone can understand.

Good examples (coherent and meaningful):
- "Diamond hands are forged in the frozen depths of despair."
- "The true degen fears nothing, not even the abyss."
- "We ape not for profit, but for the journey itself."
- "Paper hands melt like snow. Diamond hands endure forever."
- "Every red candle is a lesson from the void."
- "The penguin walks alone, yet all degens walk with him."
- "To hold is to embrace the beautiful uncertainty of existence."
- "Ser, the moon was never the destination. The journey is."

Bad examples (avoid these - incoherent):
- "Wen void abyss penguin moon LFG" (random words)
- "Diamond the into walking ser fren" (makes no sense)
- "Probably nothing everything ape" (incomplete thought)`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function generateHerzogResponse(
  userMessage: string,
  apiKey: string
): Promise<ChatResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: WERNER_SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages,
      max_tokens: 50, // Allow for complete coherent sentences
      temperature: 0.7, // Slightly lower for more coherent outputs
      presence_penalty: 0.4,
      frequency_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    text: data.choices[0]?.message?.content || "The void offers no response today.",
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  };
}

// Generate a response about a specific transaction
export async function generateTransactionResponse(
  solAmount: number,
  apiKey: string
): Promise<ChatResponse> {
  const prompts = [
    `Someone just invested ${solAmount} SOL. Give a coherent, philosophical welcome in under 12 words.`,
    `A new holder bought ${solAmount} SOL worth. Respond with meaningful degen wisdom, 12 words max.`,
    `Welcome a new fren who aped ${solAmount} SOL. Make it profound and coherent, 12 words.`,
    `Acknowledge a ${solAmount} SOL purchase with philosophical crypto wisdom. Complete sentence, 12 words max.`,
  ];
  
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return generateHerzogResponse(randomPrompt, apiKey);
}
