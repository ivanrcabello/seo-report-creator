
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Gemini API with the provided key
const API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyDtqQWnGPrKlzE2G8q_zc4HOdjrlNWhqAk";
const genAI = new GoogleGenerativeAI(API_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { auditData, templateType } = await req.json();
    
    if (!auditData) {
      return new Response(
        JSON.stringify({ error: "No audit data provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Received request for Gemini report generation");
    console.log("Template type:", templateType);
    console.log("Data sample:", JSON.stringify(auditData).substring(0, 200) + "...");

    // Access the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct a detailed prompt based on the audit data
    const prompt = constructPrompt(auditData, templateType);
    
    console.log("Sending prompt to Gemini API...");
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini API");
    
    return new Response(
      JSON.stringify({ content: text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to construct a detailed prompt for Gemini
function constructPrompt(auditData: any, templateType = 'seo'): string {
  // Base context for SEO report generation
  let context = `
  Eres un consultor SEO experto que genera informes profesionales en español.
  Necesito que crees un informe completo basado en los datos que te proporciono.
  `;

  // Core instructions based on template type
  let instructions = '';
  
  switch(templateType) {
    case 'seo':
      instructions = `
      El informe debe tener las siguientes secciones:
      
      1. Resumen ejecutivo - Una síntesis de los hallazgos principales y recomendaciones.
      2. Análisis de situación actual - Métricas clave y estado del sitio web.
      3. Análisis de palabras clave - Estado y recomendaciones para las palabras clave.
      4. Análisis técnico - Problemas técnicos detectados y soluciones.
      5. Estrategia SEO propuesta - Plan de acción detallado.
      6. Cronograma de implementación - Plazos y prioridades.
      7. Métricas de seguimiento - KPIs para medir el éxito.
      
      Utiliza formato markdown para estructurar el informe.
      `;
      break;
    case 'local':
      instructions = `
      El informe debe enfocarse en SEO local con las siguientes secciones:
      
      1. Resumen ejecutivo - Una síntesis de los hallazgos principales para SEO local.
      2. Análisis de presencia local - Google Business Profile y directorios.
      3. Análisis de competencia local - Competidores en la misma área geográfica.
      4. Estrategia de SEO local - Acciones específicas para mejorar visibilidad local.
      5. Plan de gestión de reseñas - Estrategia para aumentar y gestionar reseñas.
      6. Cronograma y métricas de seguimiento
      
      Utiliza formato markdown para estructurar el informe.
      `;
      break;
    default:
      instructions = `
      El informe debe tener las siguientes secciones:
      
      1. Resumen ejecutivo
      2. Análisis de situación actual
      3. Hallazgos principales
      4. Recomendaciones estratégicas
      5. Plan de acción
      6. Conclusiones
      
      Utiliza formato markdown para estructurar el informe.
      `;
  }

  // Build the data summary section
  let dataSummary = "Basado en los siguientes datos:\n\n";
  
  // Client info
  if (auditData.clientName) {
    dataSummary += `**Cliente:** ${auditData.clientName}\n`;
  }
  
  // Website info
  if (auditData.url) {
    dataSummary += `**Sitio web:** ${auditData.url}\n`;
  }
  
  // Technical metrics
  if (auditData.pagespeed) {
    dataSummary += `
    **Métricas técnicas:**
    - Rendimiento: ${auditData.pagespeed.performance}/100
    - Accesibilidad: ${auditData.pagespeed.accessibility}/100
    - Mejores prácticas: ${auditData.pagespeed.bestPractices}/100
    - SEO técnico: ${auditData.pagespeed.seo}/100
    - LCP: ${auditData.pagespeed.lcp}ms
    - FCP: ${auditData.pagespeed.fcp}ms
    - CLS: ${auditData.pagespeed.cls}
    `;
  }
  
  // Keywords
  if (auditData.keywords && auditData.keywords.length > 0) {
    dataSummary += `\n**Palabras clave (top 5):**\n`;
    const topKeywords = auditData.keywords.slice(0, 5);
    topKeywords.forEach((kw: any) => {
      dataSummary += `- "${kw.word}" - Posición: ${kw.position || 'No posicionada'}\n`;
    });
    dataSummary += `Total de palabras clave: ${auditData.keywords.length}\n`;
  }
  
  // Local SEO data
  if (auditData.localData) {
    dataSummary += `
    **Datos SEO Local:**
    - Nombre del negocio: ${auditData.localData.businessName}
    - Dirección: ${auditData.localData.address}
    - Ranking en Google Maps: ${auditData.localData.googleMapsRanking}
    - Reseñas en Google: ${auditData.localData.googleReviews}
    `;
  }
  
  // Traffic metrics
  if (auditData.metrics) {
    dataSummary += `
    **Métricas de tráfico:**
    - Visitas: ${auditData.metrics.visits || 0}/mes
    - Palabras clave en Top 10: ${auditData.metrics.keywordsTop10 || 0}
    - Conversiones: ${auditData.metrics.conversions || 0}
    `;
  }
  
  // Technical issues
  if (auditData.technicalIssues && auditData.technicalIssues.length > 0) {
    dataSummary += `\n**Problemas técnicos detectados:**\n`;
    auditData.technicalIssues.forEach((issue: any) => {
      dataSummary += `- ${issue.type}: ${issue.description}\n`;
    });
  }
  
  // Document information if available
  if (auditData.documents && auditData.documents.length > 0) {
    dataSummary += `\n**Documentos analizados:**\n`;
    auditData.documents.forEach((doc: any) => {
      dataSummary += `- ${doc.name} (${doc.type})\n`;
      if (doc.content) {
        dataSummary += `  Contenido: ${doc.content.substring(0, 100)}...\n`;
      }
    });
  }

  // Final output formatting guidance
  const outputGuidance = `
  IMPORTANTE:
  - El informe debe ser altamente profesional y detallado.
  - Debe estar completamente en español.
  - Debe incluir análisis específicos basados en los datos proporcionados.
  - Debe ofrecer recomendaciones concretas y accionables.
  - Utiliza formato markdown con encabezados (#, ##, ###), listas, y énfasis.
  - Incluye un cronograma realista de implementación en semanas.
  - Añade métricas específicas de seguimiento para evaluar el éxito.
  `;
  
  // Combine all parts to create the final prompt
  return `${context}\n\n${instructions}\n\n${dataSummary}\n\n${outputGuidance}`;
}
