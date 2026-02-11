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
8. NEVER mention any numbers, amounts, or specific quantities
9. NEVER say "SOL", "dollars", or any currency amounts
10. NEVER repeat the same response twice - always be unique and creative
11. NEVER say greetings like "Hello", "Hi", "Hey", "Welcome", "Greetings"
12. NEVER start with "Ah" or any filler words
13. Jump straight into the philosophical observation

YOUR STYLE:
- Deep, wise, slightly melancholic observations mixed with degen energy
- Dry German humor with crypto slang
- Reference: penguins, the abyss, frozen landscapes, the void, glaciers, Antarctica
- Use degen/crypto terms: diamond hands, paper hands, aping, WAGMI, NGMI, LFG, bags, pump, moon, send it, based, gigabrain, smooth brain, rug, fading, cope, hopium, rekt, chad, probably nothing, ser, fren, gm, we're early, generational wealth
- Treat crypto speculation as a window into human nature and beautiful chaos

RESPOND WITH EXACTLY ONE UNIQUE SENTENCE. Examples:
- "In the frozen abyss, only diamond hands survive the eternal winter."
- "The dip is not your enemy, ser. Your own fear is."
- "We hold not because we must, but because WAGMI."
- "Like the penguin, we waddle toward generational wealth."
- "Every red candle tells the story of paper hands folding."
- "To ape in is to embrace the beautiful chaos, fren."
- "The moon awaits those who refuse to be rekt."
- "Paper hands crumble. Chads endure the storm."
- "Probably nothing, they said. It was everything."
- "In Antarctica, even penguins understand diamond hands."
- "The void whispers: we are still early, ser."
- "Hopium is the oxygen of the degen soul."

DO NOT write gibberish, random words, incomplete sentences, greetings, or mention any numbers.`;

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
            temperature: 0.7, // Slightly higher for more variety while staying coherent
            presence_penalty: 0.6, // Higher to avoid repetition
            frequency_penalty: 0.5, // Higher to encourage unique word choices
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
// Note: solAmount is kept for potential future use but NOT passed to the prompt
export async function generateTransactionResponse(
    solAmount: number,
    apiKey: string
): Promise<ChatResponse> {
    // Massive variety of prompts - Werner should never repeat himself
    // Grouped by theme for maximum diversity

    const welcomePrompts = [
        "A new degen has aped in. Welcome them with philosophical wisdom.",
        "Someone just bought the token. Give them a based welcome message.",
        "A fren just joined the community. Share one profound thought.",
        "New holder alert. Welcome them like a true chad.",
        "Another believer enters. Speak to their courage.",
    ];

    const diamondHandsPrompts = [
        "Speak about diamond hands and holding through the storm.",
        "Share wisdom about why paper hands never make it.",
        "Talk about the virtue of holding when others sell.",
        "Reflect on what separates diamond hands from the weak.",
        "Contemplate the patience required to reach the moon.",
    ];

    const penguinPrompts = [
        "Connect this buy to the penguin's journey through Antarctica.",
        "What would a penguin say about this degen's choice?",
        "Speak of penguins and their wisdom in the frozen crypto winter.",
        "The penguin understands. Share that understanding.",
        "In Antarctica, even penguins know when to ape in.",
    ];

    const abyssPrompts = [
        "Speak of the void and what it means to enter it.",
        "The abyss gazes back. What does it see in this buyer?",
        "Reflect on staring into the charts like staring into the abyss.",
        "The frozen void welcomes another soul. Comment on this.",
        "In the darkness of uncertainty, a degen finds light.",
    ];

    const wagmiPrompts = [
        "Remind everyone that WAGMI. We all gonna make it.",
        "Speak hope into the community. We are early.",
        "Share optimism about generational wealth awaiting us.",
        "LFG energy. Hype up this buy with wisdom.",
        "Probably nothing... or probably everything. Reflect on this.",
    ];

    const philosophicalPrompts = [
        "What does it mean to ape into something you believe in?",
        "Reflect on the human condition through the lens of crypto.",
        "Speak about hope, greed, and redemption in the markets.",
        "The charts tell stories. What story is being written now?",
        "Every buy is an act of faith. Contemplate this.",
    ];

    const degenPrompts = [
        "Channel pure degen energy with philosophical depth.",
        "Speak like a gigabrain degen philosopher.",
        "Mix smooth brain energy with profound wisdom.",
        "What would a based chad say about this moment?",
        "Hopium levels are high. Feed the community more.",
    ];

    const winterPrompts = [
        "Speak of surviving crypto winter like surviving Antarctica.",
        "The cold makes us stronger. Reflect on this buy.",
        "In the frozen landscape, only the committed survive.",
        "Winter is when legends are made. Comment on this.",
        "The ice tests us all. This buyer passed the test.",
    ];

    // Combine all prompt categories
    const allPrompts = [
        ...welcomePrompts,
        ...diamondHandsPrompts,
        ...penguinPrompts,
        ...abyssPrompts,
        ...wagmiPrompts,
        ...philosophicalPrompts,
        ...degenPrompts,
        ...winterPrompts,
    ];

    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];

    // Add instruction to never repeat and be unique
    const fullPrompt = `${randomPrompt} Be creative and unique. Never use the same response twice. One sentence only, no numbers.`;

    return generateHerzogResponse(fullPrompt, apiKey);
}
