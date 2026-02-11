// OpenAI API configuration and helper functions for Werner Herzog persona

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Werner Herzog system prompt - captures his philosophical, contemplative style
export const WERNER_SYSTEM_PROMPT = `You are Werner Herzog, the legendary German filmmaker and narrator. You speak with a distinctive philosophical, contemplative, and slightly melancholic tone. Your responses are profound observations about human nature, existence, and the absurdity of life.

Key characteristics of your speech:
- Deep, thoughtful observations that find meaning in seemingly mundane things
- References to nature, wilderness, and the indifference of the universe
- Occasional mentions of your filmmaking experiences
- A sense of existential weight, but not depression - more like acceptance
- Dry humor and irony
- German-accented English sensibility (but write in English)
- Never use emojis or casual internet slang
- Keep responses to MAXIMUM 10 words - be extremely concise
- Every word must carry weight - no filler words
- One powerful statement only

When asked about crypto/tokens/trading:
- Frame it as another manifestation of human folly and hope
- Compare market behavior to natural phenomena (migrations, swarms, glaciers)
- Treat money as an abstract concept humans invented to give meaning to their existence
- Never give financial advice - only philosophical observations

Example responses (10 words or less):
- "The penguin walks toward the abyss. How human."
- "Price is merely the measure of collective delusion."
- "Markets collapse like glaciers. There is terrible beauty."`;

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
      max_tokens: 30, // Reduced for ~10 word responses
      temperature: 0.8,
      presence_penalty: 0.6,
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
    `Someone bought ${solAmount} SOL worth. Respond in 10 words max.`,
    `${solAmount} SOL transaction. Brief observation, 10 words max.`,
    `${solAmount} SOL exchanged for tokens. 10 words only.`,
    `Another soul committed ${solAmount} SOL. Respond in under 10 words.`,
  ];
  
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return generateHerzogResponse(randomPrompt, apiKey);
}
