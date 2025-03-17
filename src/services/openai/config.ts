
// OpenAI API configuration
import OpenAI from "openai";
import { getApiKeys } from "@/services/settingsService";
import { toast } from "sonner";

// Common OpenAI API call function
export async function callOpenAI(
  prompt: string, 
  systemPrompt: string,
  model: string = "gpt-4o",
  temperature: number = 0.7,
  maxTokens: number = 3000
): Promise<string | null> {
  try {
    console.log("Calling OpenAI API with prompt:", prompt.substring(0, 50) + "...");
    
    // Get API key from the database
    const apiKeys = await getApiKeys();
    if (!apiKeys || !apiKeys.openaiApiKey) {
      console.error("No OpenAI API key found in settings");
      toast.error("No se ha configurado la clave API de OpenAI. Por favor, configúrela en la sección de Configuración > API Keys.");
      throw new Error("No se ha configurado la clave API de OpenAI. Por favor, configúrela en la sección de Configuración > API Keys.");
    }

    console.log("Creating OpenAI instance with API key");
    
    // Create OpenAI instance with the stored API key
    const openai = new OpenAI({
      apiKey: apiKeys.openaiApiKey,
    });

    console.log("Sending request to OpenAI API with model:", model);
    
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

    console.log("OpenAI API response received:", response.choices ? "Has choices" : "No choices");
    
    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      console.log("OpenAI content received, length:", content ? content.length : 0);
      return response.choices[0].message.content || null;
    } else {
      console.error("No content received from OpenAI API");
      throw new Error("No se recibió contenido de la API de OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    toast.error("Error al llamar a la API de OpenAI: " + (error instanceof Error ? error.message : "Error desconocido"));
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
