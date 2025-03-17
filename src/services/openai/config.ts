
import { OpenAI } from "openai";
import { getApiKeys } from "../settingsService";

/**
 * Llama a la API de OpenAI para generar contenido
 * @param prompt El texto del prompt a enviar
 * @param systemPrompt Instrucciones de sistema para el modelo
 * @param model Modelo de OpenAI a usar (por defecto gpt-3.5-turbo)
 * @returns El texto generado o null si hay error
 */
export async function callOpenAI(
  prompt: string, 
  systemPrompt: string = "",
  model: string = "gpt-3.5-turbo",
  temperature: number = 0.7,
  max_tokens: number = 2500
): Promise<string | null> {
  console.info("Calling OpenAI API with prompt:", prompt.substring(0, 50) + "...");
  
  try {
    // Obtener las API keys desde la base de datos
    console.info("Fetching API keys from the database");
    const settings = await getApiKeys();
    
    if (!settings || !settings.openaiApiKey) {
      console.error("No OpenAI API key found in settings");
      return null;
    }
    
    console.info("API keys retrieved successfully:", settings.id);
    
    // Crear instancia de OpenAI con la API key
    console.info("Creating OpenAI instance with API key");
    const openai = new OpenAI({ 
      apiKey: settings.openaiApiKey,
      dangerouslyAllowBrowser: true // Permitir uso en el navegador (con precaución)
    });
    
    // Definir los tipos correctos para los mensajes
    const messages: Array<{role: "system" | "user" | "assistant"; content: string}> = [];
    
    // Añadir mensaje del sistema si existe
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    
    // Añadir mensaje del usuario
    messages.push({ role: "user", content: prompt });
    
    // Hacer la llamada a la API
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
    });
    
    // Devolver el contenido generado
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
