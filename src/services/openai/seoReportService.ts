
import { AuditResult } from "../pdfAnalyzer";
import { callOpenAI } from "./config";

/**
 * Generates an SEO report using OpenAI based on audit results
 * @param auditResult Audit data to use for the report
 * @returns A string containing the generated report in markdown format
 */
export async function generateSEOReport(auditResult: AuditResult): Promise<string | null> {
  try {
    // Skip API call if no URL is provided (need at least some data)
    if (!auditResult) {
      console.warn("No audit data provided for SEO report generation");
      return null;
    }

    const prompt = `
Genera un informe SEO profesional y detallado para la siguiente página web:

URL: ${auditResult.url || 'No disponible'}
Nombre de la empresa: ${auditResult.companyName || 'No especificado'}
Tipo de negocio: ${auditResult.companyType || 'No especificado'}
Ubicación: ${auditResult.location || 'No especificada'}

Información técnica:
- Puntuación SEO: ${auditResult.seoScore || 'No disponible'}
- Puntuación de rendimiento: ${auditResult.performance || 'No disponible'}
- Palabras clave: ${auditResult.keywords?.length ? auditResult.keywords.map(k => k.word).join(', ') : 'No disponibles'}

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

    const systemPrompt = "Eres un consultor SEO experto especializado en la creación de informes profesionales para clientes. Tus informes son detallados, claros, técnicamente precisos y orientados a la acción.";
    
    return await callOpenAI(prompt, systemPrompt);
  } catch (error) {
    console.error("Error generando informe SEO con OpenAI:", error);
    return null;
  }
}
