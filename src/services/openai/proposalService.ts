
import { callOpenAI } from "./config";

/**
 * Generates a proposal content using OpenAI
 * @param clientData Client information
 * @param packData Package details
 * @returns A string containing the generated proposal in markdown format
 */
export async function generateProposalContent(clientData: any, packData: any): Promise<string | null> {
  try {
    const prompt = `
Genera una propuesta comercial profesional para el siguiente cliente:

Cliente: ${clientData.name || 'No especificado'}
Empresa: ${clientData.company || 'No especificada'}
Industria: ${clientData.industry || 'No especificada'}
Ubicación: ${clientData.location || 'No especificada'}

Paquete seleccionado:
Nombre: ${packData.name || 'No especificado'}
Precio: ${packData.price || 'No especificado'}€
Descripción: ${packData.description || 'No especificada'}

Características incluidas:
${packData.features ? packData.features.map((f: string) => `- ${f}`).join('\n') : 'No especificadas'}

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

    const systemPrompt = "Eres un experto en marketing digital y ventas especializado en la creación de propuestas comerciales persuasivas. Tus propuestas son profesionales, orientadas a resultados y destacan el valor del servicio ofrecido. Escribe siempre en español.";
    
    return await callOpenAI(prompt, systemPrompt);
  } catch (error) {
    console.error("Error generando propuesta con OpenAI:", error);
    return null;
  }
}
