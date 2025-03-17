
// OpenAI API configuration
import OpenAI from "openai";
import { getApiKeys } from "@/services/settingsService";

// Common OpenAI API call function
export async function callOpenAI(
  prompt: string, 
  systemPrompt: string,
  model: string = "gpt-4o",
  temperature: number = 0.7,
  maxTokens: number = 3000
): Promise<string | null> {
  try {
    // Get API key from the database
    const apiKeys = await getApiKeys();
    if (!apiKeys || !apiKeys.openaiApiKey) {
      throw new Error("No se ha configurado la clave API de OpenAI. Por favor, configúrela en la sección de Configuración > API Keys.");
    }

    // Create OpenAI instance with the stored API key
    const openai = new OpenAI({
      apiKey: apiKeys.openaiApiKey,
    });

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

// Export interface for OpenAI response
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
