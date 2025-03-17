import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

// Get Gemini API key from environment variables
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY env var not found')
}

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Gemini Report function called")
    
    // Parse request body
    let body;
    try {
      body = await req.json()
      console.log("Request body parsed successfully")
    } catch (e) {
      console.error("Error parsing request body:", e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    const { auditData, templateType } = body
    
    if (!auditData) {
      console.error("Missing audit data in request")
      return new Response(
        JSON.stringify({ error: 'Audit data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    console.log("Template type:", templateType || 'seo')
    console.log("Company name:", auditData.companyName || 'Not provided')
    
    // Check API key again for debugging
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured in the environment")
      return new Response(
        JSON.stringify({ error: 'API key for Gemini is not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Initialize Gemini API
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create a prompt based on audit data
      const prompt = createSeoReportPrompt(auditData, templateType);
      console.log("Prompt created, length:", prompt.length);
      
      // If prompt is too large, we might have issues
      if (prompt.length > 100000) {
        console.warn("Warning: Prompt is very large, may exceed API limits");
      }
      
      // Generate response with Gemini
      console.log("Calling Gemini API...");
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 8000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      });
      
      console.log("Gemini API response received");
      const generatedText = result.response.text();
      console.log("Response length:", generatedText.length);
      
      // Return the generated content
      return new Response(
        JSON.stringify({ 
          content: generatedText,
          model: "gemini-pro",
          prompt: "SEO Report generation"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
      
      return new Response(
        JSON.stringify({ 
          error: `Error calling Gemini API: ${errorMessage}`,
          details: apiError instanceof Error && apiError.stack ? apiError.stack : 'No stack available'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in gemini-report function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: `Unhandled error in gemini-report function: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Create a prompt for the SEO report
function createSeoReportPrompt(auditData, templateType = 'seo') {
  console.log("Creating prompt with template type:", templateType);
  
  // Safety check for null auditData
  if (!auditData) {
    console.error("auditData is null or undefined");
    return "Please provide audit data for the SEO report.";
  }
  
  // Safely extract data with defaults to avoid errors
  const url = auditData.url || 'No URL provided';
  const companyName = auditData.companyName || 'the company';
  const seoScore = auditData.seoScore || 0;
  const performanceScore = auditData.performance || 0;
  const keywordsCount = auditData.keywordsCount || 0;
  
  let basePrompt = `Genera un informe SEO detallado para ${companyName} sobre el sitio web ${url}. 
El informe debe estar en formato markdown y en español.

Datos del análisis:
- URL: ${url}
- Empresa: ${companyName}
- Puntuación SEO: ${seoScore}/100
- Rendimiento: ${performanceScore}/100
- Palabras clave rastreadas: ${keywordsCount}

`;

  // Add specific sections based on template type
  if (templateType === 'seo') {
    if (auditData.seoResults) {
      basePrompt += `
Sección SEO On-Page:
- Meta título: ${auditData.seoResults.metaTitle ? 'Correcto' : 'Falta o incorrecto'}
- Meta descripción: ${auditData.seoResults.metaDescription ? 'Correcta' : 'Falta o incorrecta'}
- Etiquetas H1: ${auditData.seoResults.h1Tags || 'No detectadas'} encontradas
- Etiqueta canónica: ${auditData.seoResults.canonicalTag ? 'Implementada' : 'No implementada'}
- Densidad de palabras clave: ${auditData.seoResults.keywordDensity || 'No disponible'}%
- Longitud del contenido: ${auditData.seoResults.contentLength || 'No disponible'} palabras
- Enlaces internos: ${auditData.seoResults.internalLinks || 'No disponible'}
- Enlaces externos: ${auditData.seoResults.externalLinks || 'No disponible'}
`;
    } else {
      basePrompt += `
Sección SEO On-Page:
- No hay datos disponibles de SEO On-Page
`;
    }

    if (auditData.technicalResults) {
      basePrompt += `
Sección SEO Técnico:
- Estado SSL: ${auditData.technicalResults.sslStatus || 'No verificado'}
- Redirección HTTPS: ${auditData.technicalResults.httpsRedirection ? 'Implementada' : 'No implementada'}
- Optimización móvil: ${auditData.technicalResults.mobileOptimization ? 'Correcta' : 'Necesita mejoras'}
- Robots.txt: ${auditData.technicalResults.robotsTxt ? 'Correcto' : 'Falta o incorrecto'}
- Sitemap: ${auditData.technicalResults.sitemap ? 'Encontrado' : 'No encontrado'}
- Tecnologías detectadas: ${Array.isArray(auditData.technicalResults.technologies) ? auditData.technicalResults.technologies.join(', ') : 'No disponible'}
`;
    } else {
      basePrompt += `
Sección SEO Técnico:
- No hay datos disponibles de SEO Técnico
`;
    }

    if (auditData.performanceResults) {
      basePrompt += `
Sección Rendimiento:
- Puntuación de velocidad (desktop): ${auditData.performanceResults.pageSpeed?.desktop || 'N/A'}/100
- Puntuación de velocidad (mobile): ${auditData.performanceResults.pageSpeed?.mobile || 'N/A'}/100
- Tiempo de carga: ${auditData.performanceResults.loadTime || 'N/A'}
- Recursos totales: ${auditData.performanceResults.resourceCount || 'N/A'}
- Optimización de imágenes: ${auditData.performanceResults.imageOptimization ? 'Correcta' : 'Necesita mejoras'}
- Implementación de caché: ${auditData.performanceResults.cacheImplementation ? 'Correcta' : 'Necesita mejoras'}
`;
    } else {
      basePrompt += `
Sección Rendimiento:
- No hay datos disponibles de Rendimiento
`;
    }
  } else if (templateType === 'local') {
    if (auditData.localData) {
      basePrompt += `
Sección SEO Local:
- Nombre del negocio: ${auditData.localData.businessName || 'No disponible'}
- Dirección: ${auditData.localData.address || 'No disponible'}
- Posición en Google Maps: ${auditData.localData.googleMapsRanking || 'No disponible'}
- Reseñas en Google: ${auditData.localData.googleReviews || 0}
`;
    } else {
      basePrompt += `
Sección SEO Local:
- No hay datos disponibles de SEO Local
`;
    }
  }
  
  // Core web vitals if available
  if (auditData.pagespeed) {
    basePrompt += `
Core Web Vitals:
- LCP (Largest Contentful Paint): ${auditData.pagespeed.lcp || 'N/A'}ms
- FID/TBT (First Input Delay / Total Blocking Time): ${auditData.pagespeed.tbt || 'N/A'}ms
- CLS (Cumulative Layout Shift): ${auditData.pagespeed.cls || 'N/A'}
- Puntuación SEO: ${auditData.pagespeed.seo || 'N/A'}/100
- Puntuación Accesibilidad: ${auditData.pagespeed.accessibility || 'N/A'}/100
- Puntuación Mejores Prácticas: ${auditData.pagespeed.bestPractices || 'N/A'}/100
`;
  }
  
  // Add section about documents if available
  if (auditData.documents && auditData.documents.length > 0) {
    basePrompt += `
Documentos analizados:
${auditData.documents.map((doc, index) => `${index + 1}. ${doc.name || 'Documento sin nombre'}`).join('\n')}

Basado en estos documentos, incluye recomendaciones específicas en el informe.
`;
  }
  
  // Instructions for report format
  basePrompt += `
Estructura el informe con las siguientes secciones:

1. **Resumen Ejecutivo**: Breve resumen del análisis y hallazgos principales.
2. **Análisis de Situación Actual**: Detalles sobre el rendimiento actual del sitio web.
3. **Hallazgos Principales**: Los problemas más importantes encontrados.
4. **Recomendaciones Prioritarias**: Lista de acciones recomendadas en orden de prioridad.
5. **Plan de Acción**: Pasos concretos para mejorar el SEO del sitio.

El informe debe ser profesional, informativo y práctico. Usa markdown para formatear el informe con encabezados, listas y énfasis donde sea apropiado.
`;

  console.log("Prompt created successfully");
  return basePrompt;
}
