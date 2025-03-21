
import { callOpenAI } from "./config";
import { Client, Pack } from "@/types/client";

/**
 * Genera una propuesta de contenido utilizando OpenAI
 * @param clientData Información del cliente
 * @param packData Detalles del paquete
 * @param additionalNotes Notas adicionales para la propuesta
 * @returns Una cadena que contiene la propuesta generada en formato markdown
 */
export async function generateProposalContent(
  clientData: Client, 
  packData: Pack, 
  additionalNotes?: string
): Promise<string | null> {
  try {
    // Construimos el prompt base con la información del cliente y paquete
    let prompt = `
Genera una propuesta comercial profesional para el siguiente cliente:

Cliente: ${clientData.name || 'No especificado'}
Empresa: ${clientData.company || 'No especificada'}

Paquete seleccionado:
Nombre: ${packData.name || 'No especificado'}
Precio: ${packData.price || 'No especificado'}€
Descripción: ${packData.description || 'No especificada'}

Características incluidas:
${packData.features ? packData.features.map((f: string) => `- ${f}`).join('\n') : 'No especificadas'}
`;

    // Añadimos las notas adicionales si existen
    if (additionalNotes && additionalNotes.trim().length > 0) {
      prompt += `\nNotas adicionales para incluir en la propuesta:\n${additionalNotes}\n`;
      console.log("Incluyendo notas adicionales en el prompt:", additionalNotes);
    } else {
      console.log("No hay notas adicionales para incluir");
    }

    // Añadimos las instrucciones finales para la generación
    prompt += `
Crea una propuesta detallada en formato markdown que incluya:

1. Introducción personalizada al cliente
2. Descripción detallada de la situación actual
3. Objetivos propuestos
4. Solución propuesta con detalle del paquete seleccionado
5. Beneficios esperados con métricas específicas
6. Proceso de implementación con timeline
7. Términos y condiciones
8. Conclusión persuasiva

La propuesta debe ser persuasiva, profesional, destacar el valor del servicio y estar en español.
`;

    const systemPrompt = "Eres un experto en marketing digital y ventas especializado en la creación de propuestas comerciales persuasivas en español. Tus propuestas son profesionales, orientadas a resultados y destacan el valor del servicio ofrecido. Escribe siempre en español usando un tono formal pero cercano.";
    
    console.log("Enviando prompt a OpenAI con longitud:", prompt.length);
    
    return await callOpenAI(prompt, systemPrompt);
  } catch (error) {
    console.error("Error generando propuesta con OpenAI:", error);
    return null;
  }
}
