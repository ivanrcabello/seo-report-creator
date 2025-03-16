
// OpenAI API configuration

// Define the OpenAI API key
export const OPENAI_API_KEY = "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";

export const API_URL = "https://api.openai.com/v1/chat/completions";

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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`Error en la API de OpenAI: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No se recibió contenido de la API de OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
