
// OpenAI API configuration
import OpenAI from "openai";

// Define the OpenAI API key - esto se cargará desde los secretos de Supabase en las Edge Functions
export const OPENAI_API_KEY = "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";

// OpenAI client instance
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Common OpenAI API call function
export async function callOpenAI(
  prompt: string, 
  systemPrompt: string,
  model: string = "gpt-4o",
  temperature: number = 0.7,
  maxTokens: number = 3000
): Promise<string | null> {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content || null;
    } else {
      throw new Error("No se recibió contenido de la API de OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
