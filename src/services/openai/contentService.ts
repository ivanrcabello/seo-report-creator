
import { callOpenAI } from "./config";

/**
 * Generates content based on a prompt using OpenAI
 * @param prompt The prompt to generate content from
 * @param systemPrompt Optional system prompt to guide the generation
 * @returns Generated content as a string
 */
export async function generateAIContent(prompt: string, systemPrompt: string = ""): Promise<string | null> {
  try {
    const defaultSystemPrompt = "Eres un asistente profesional especializado en marketing digital y SEO. Proporcionas respuestas detalladas, técnicamente precisas y orientadas a la acción.";
    
    return await callOpenAI(prompt, systemPrompt || defaultSystemPrompt, "gpt-4o", 0.7, 2000);
  } catch (error) {
    console.error("Error generando contenido con OpenAI:", error);
    return null;
  }
}
