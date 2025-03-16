
import { AuditResult } from "./pdfAnalyzer";

// Define the OpenAI API key
const OPENAI_API_KEY = "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";

const API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
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

export async function generateSEOReport(auditResult: AuditResult): Promise<string | null> {
  try {
    // Skip API call if no URL is provided
    if (!auditResult.url) {
      console.warn("No URL provided for SEO report generation");
      return null;
    }

    const prompt = `
Genera un informe SEO profesional y detallado para la siguiente página web:

URL: ${auditResult.url}
Nombre de la empresa: ${auditResult.companyName || 'No especificado'}
Tipo de negocio: ${auditResult.companyType || 'No especificado'}
Ubicación: ${auditResult.location || 'No especificada'}

Información técnica:
- Puntuación SEO: ${auditResult.seoScore || 'No disponible'}
- Puntuación de rendimiento: ${auditResult.performance || 'No disponible'}
- Palabras clave: ${auditResult.keywords ? auditResult.keywords.map(k => k.word).join(', ') : 'No disponibles'}

Crea un informe detallado en formato markdown que incluya:

1. Introducción personalizada
2. Análisis de la situación actual con métricas detalladas
3. Análisis de palabras clave prioritarias con recomendaciones
4. Análisis de competidores
5. Estrategia SEO propuesta con secciones para:
   - Optimización técnica
   - SEO Local
   - Estrategia de contenidos
   - Estrategia de linkbuilding
6. Planes recomendados con precios y características detalladas
7. Conclusión con timeline de resultados esperados
8. Información de contacto

El informe debe estar en español, ser muy profesional, incluir detalles técnicos pero ser comprensible para un cliente, y tener un formato markdown con secciones claras usando ## y ### para los títulos.
`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Eres un consultor SEO experto especializado en la creación de informes profesionales para clientes. Tus informes son detallados, claros, técnicamente precisos y orientados a la acción."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
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
    console.error("Error generando informe SEO con OpenAI:", error);
    return null;
  }
}

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

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Eres un experto en marketing digital y ventas especializado en la creación de propuestas comerciales persuasivas. Tus propuestas son profesionales, orientadas a resultados y destacan el valor del servicio ofrecido."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
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
    console.error("Error generando propuesta con OpenAI:", error);
    return null;
  }
}

export async function generateAIContent(prompt: string, systemPrompt: string = ""): Promise<string | null> {
  try {
    const defaultSystemPrompt = "Eres un asistente profesional especializado en marketing digital y SEO. Proporcionas respuestas detalladas, técnicamente precisas y orientadas a la acción.";
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt || defaultSystemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
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
    console.error("Error generando contenido con OpenAI:", error);
    return null;
  }
}
