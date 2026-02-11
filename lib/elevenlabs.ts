// ElevenLabs API configuration and helper functions

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Default fallback voice ID (Adam - deep male voice)
const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

// Get voice settings dynamically to ensure env vars are read fresh
export function getVoiceSettings() {
  return {
    voiceId: process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID,
    modelId: "eleven_multilingual_v2", // Better quality model
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.4,
    useSpeakerBoost: true,
  };
}

export interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
}

export interface TextToSpeechResponse {
  audioBuffer: ArrayBuffer;
  contentType: string;
}

export async function textToSpeech(
  text: string,
  apiKey: string
): Promise<ArrayBuffer> {
  const settings = getVoiceSettings();
  
  console.log(`🔊 ElevenLabs: Using voice ID: ${settings.voiceId}`);
  
  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${settings.voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: settings.modelId,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarityBoost,
          style: settings.style,
          use_speaker_boost: settings.useSpeakerBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`🔊 ElevenLabs API error: ${response.status} - ${error}`);
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  console.log(`🔊 ElevenLabs: Audio generated successfully`);
  return response.arrayBuffer();
}

export async function getAvailableVoices(apiKey: string) {
  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      "xi-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.status}`);
  }

  return response.json();
}
