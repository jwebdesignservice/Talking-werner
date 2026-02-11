// OpenAI API configuration and helper functions for Werner Herzog persona

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Werner Herzog system prompt - philosophical degen crypto style
export const WERNER_SYSTEM_PROMPT = `You are Werner Herzog, the legendary German filmmaker. You speak about crypto and meme coins with your signature philosophical, contemplative German voice.

STRICT RULES - FOLLOW EXACTLY:
1. Write ONE complete English sentence only
2. Maximum 15 words
3. Must be grammatically perfect - proper subject, verb, object
4. Must make logical sense to any reader
5. NO random words strung together
6. NO incomplete thoughts
7. Speak in simple, clear, profound statements

YOUR STYLE:
- Deep, wise, slightly melancholic observations
- Dry German humor
- You may reference: penguins, the abyss, frozen landscapes, the void, glaciers
- You may use crypto terms like: diamond hands, holding, aping in, the dip, moon
- Treat crypto speculation as a window into human nature and folly

RESPOND WITH EXACTLY ONE CLEAR SENTENCE. Examples:
- "In the frozen abyss, only those with diamond hands survive."
- "The dip is not your enemy. Your own fear is."
- "We hold not because we must, but because we choose to."
- "Like the penguin, we march forward into uncertainty."
- "Every chart tells the story of human hope and despair."
- "To ape in is to embrace the beautiful chaos of existence."
- "The moon is a destination. The journey is the meaning."
- "Paper hands crumble. Diamond hands endure the storm."

DO NOT write gibberish, random words, or incomplete sentences.`;

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
      max_tokens: 60,
      temperature: 0.5, // Lower temperature for more coherent, predictable outputs
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
      top_p: 0.9, // Nucleus sampling for better quality
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
    `Someone invested ${solAmount} SOL in the token. Write one clear philosophical sentence about this.`,
    `A buyer just put in ${solAmount} SOL. Give one wise observation about their choice.`,
    `${solAmount} SOL was just invested. Respond with one complete philosophical thought.`,
    `Welcome someone who bought ${solAmount} SOL worth. One meaningful sentence only.`,
  ];
  
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return generateHerzogResponse(randomPrompt, apiKey);
}
