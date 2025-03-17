
import { OpenAI } from "openai";
import { getSettings } from "../settingsService";

/**
 * Llama a la API de OpenAI para generar contenido
 * @param prompt El texto del prompt a enviar
 * @param systemPrompt Instrucciones de sistema para el modelo
 * @returns El texto generado o null si hay error
 */
export async function callOpenAI(prompt: string, systemPrompt: string = ""): Promise<string | null> {
  console.info("Calling OpenAI API with prompt:", prompt.substring(0, 50) + "...");
  
  try {
    // Obtener las API keys desde la base de datos
    console.info("Fetching API keys from the database");
    const settings = await getSettings();
    
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
    
    // Hacer la llamada a la API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    // Devolver el contenido generado
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
