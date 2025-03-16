
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY env var not found')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { auditData, templateType } = await req.json()
    
    if (!auditData) {
      return new Response(
        JSON.stringify({ error: 'Audit data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a template for the report based on SEO audit data
    const prompt = createSeoReportPrompt(auditData, templateType)

    // Generate response with Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 8000,
      },
    })

    const response = result.response
    const generatedText = response.text()

    // Return the generated content
    return new Response(
      JSON.stringify({ 
        content: generatedText,
        model: "gemini-pro",
        prompt: "SEO Report generation"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating report with Gemini:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Create a prompt for the SEO report
function createSeoReportPrompt(auditData, templateType = 'seo') {
  const { url, companyName, seoResults, technicalResults, performanceResults, 
          keywords, localData, metrics, pagespeed } = auditData

  let basePrompt = `Genera un informe SEO detallado para ${companyName} sobre el sitio web ${url}. 
El informe debe estar en formato markdown y en español.

Datos del análisis:
- URL: ${url}
- Empresa: ${companyName}
- Puntuación SEO: ${auditData.seoScore}/100
- Rendimiento: ${auditData.performance}/100
- Palabras clave rastreadas: ${auditData.keywordsCount}

`

  // Add specific sections based on the template type
  if (templateType === 'seo') {
    basePrompt += `
Sección SEO On-Page:
${seoResults ? `
- Meta título: ${seoResults.metaTitle ? 'Correcto' : 'Falta o incorrecto'}
- Meta descripción: ${seoResults.metaDescription ? 'Correcta' : 'Falta o incorrecta'}
- Etiquetas H1: ${seoResults.h1Tags} encontradas
- Etiqueta canónica: ${seoResults.canonicalTag ? 'Implementada' : 'No implementada'}
- Densidad de palabras clave: ${seoResults.keywordDensity}%
- Longitud del contenido: ${seoResults.contentLength} palabras
- Enlaces internos: ${seoResults.internalLinks}
- Enlaces externos: ${seoResults.externalLinks}
` : '- No hay datos disponibles de SEO On-Page'}

Sección SEO Técnico:
${technicalResults ? `
- Estado SSL: ${technicalResults.sslStatus}
- Redirección HTTPS: ${technicalResults.httpsRedirection ? 'Implementada' : 'No implementada'}
- Optimización móvil: ${technicalResults.mobileOptimization ? 'Correcta' : 'Necesita mejoras'}
- Robots.txt: ${technicalResults.robotsTxt ? 'Correcto' : 'Falta o incorrecto'}
- Sitemap: ${technicalResults.sitemap ? 'Encontrado' : 'No encontrado'}
- Tecnologías detectadas: ${technicalResults.technologies.join(', ')}
` : '- No hay datos disponibles de SEO Técnico'}

Sección Rendimiento:
${performanceResults ? `
- Puntuación de velocidad (desktop): ${performanceResults.pageSpeed?.desktop || 'N/A'}/100
- Puntuación de velocidad (mobile): ${performanceResults.pageSpeed?.mobile || 'N/A'}/100
- Tiempo de carga: ${performanceResults.loadTime || 'N/A'}
- Recursos totales: ${performanceResults.resourceCount || 'N/A'}
- Optimización de imágenes: ${performanceResults.imageOptimization ? 'Correcta' : 'Necesita mejoras'}
- Implementación de caché: ${performanceResults.cacheImplementation ? 'Correcta' : 'Necesita mejoras'}
` : '- No hay datos disponibles de Rendimiento'}

${keywords && keywords.length > 0 ? `Palabras clave principales:
${keywords.slice(0, 10).map(kw => `- "${kw.word}": Posición actual ${kw.position || 'No posicionada'} (Objetivo: ${kw.targetPosition || 'Top 10'})`).join('\n')}
` : '- No hay datos disponibles de palabras clave'}

${metrics ? `Métricas actuales:
- Visitas mensuales: ${metrics.visits || 'N/A'}
- Keywords en top 10: ${metrics.keywordsTop10 || 'N/A'}
- Conversiones: ${metrics.conversions || 'N/A'}
` : ''}
`
  } else if (templateType === 'local') {
    basePrompt += `
Sección SEO Local:
${localData ? `
- Nombre del negocio: ${localData.businessName}
- Dirección: ${localData.address}
- Posición en Google Maps: ${localData.googleMapsRanking || 'No disponible'}
- Reseñas en Google: ${localData.googleReviews || 0}
` : '- No hay datos disponibles de SEO Local'}

${keywords && keywords.length > 0 ? `Palabras clave locales principales:
${keywords.slice(0, 10).map(kw => `- "${kw.word}": Posición actual ${kw.position || 'No posicionada'} (Objetivo: ${kw.targetPosition || 'Top 10'})`).join('\n')}
` : '- No hay datos disponibles de palabras clave locales'}
`
  }
  
  // Core web vitals if available
  if (pagespeed) {
    basePrompt += `
Core Web Vitals:
- LCP (Largest Contentful Paint): ${pagespeed.lcp || 'N/A'}ms
- FID/TBT (First Input Delay / Total Blocking Time): ${pagespeed.tbt || 'N/A'}ms
- CLS (Cumulative Layout Shift): ${pagespeed.cls || 'N/A'}
- Puntuación SEO: ${pagespeed.seo || 'N/A'}/100
- Puntuación Accesibilidad: ${pagespeed.accessibility || 'N/A'}/100
- Puntuación Mejores Prácticas: ${pagespeed.bestPractices || 'N/A'}/100
`
  }
  
  // Instructions for the report format
  basePrompt += `
Estructura el informe con las siguientes secciones:

1. **Resumen Ejecutivo**: Breve resumen del análisis y hallazgos principales.
2. **Análisis de Situación Actual**: Detalles sobre el rendimiento actual del sitio web.
3. **Hallazgos Principales**: Los problemas más importantes encontrados.
4. **Recomendaciones Prioritarias**: Lista de acciones recomendadas en orden de prioridad.
5. **Plan de Acción**: Pasos concretos para mejorar el SEO del sitio.

El informe debe ser profesional, informativo y práctico. Usa markdown para formatear el informe con encabezados, listas y énfasis donde sea apropiado.
`

  return basePrompt
}
