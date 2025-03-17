
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.13.0";
import { corsHeaders } from "../cors.ts";

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse request body
    const requestBody = await req.json();
    const { auditResult, templateType, customPrompt, apiKey } = requestBody;

    // Validate request
    if (!auditResult) {
      console.error("No audit data provided");
      return new Response(
        JSON.stringify({ error: "No audit data provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!apiKey) {
      console.error("No API key provided");
      return new Response(
        JSON.stringify({ error: "No API key provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Processing request for template type:", templateType);
    console.log("Company name:", auditResult.companyName);

    // Initialize OpenAI with the provided API key
    const openai = new OpenAI({ apiKey });
    
    // Get the correct system prompt based on template type
    const systemPrompt = getSystemPrompt(templateType);
    
    // Prepare the user prompt with audit data
    const combinedPrompt = customPrompt 
      ? `${customPrompt}\n\nAudit data: ${JSON.stringify(auditResult)}` 
      : `Genera un informe SEO detallado en español para ${auditResult.companyName} basado en estos datos de auditoría: ${JSON.stringify(auditResult)}`;

    console.log("Calling OpenAI API");
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Extract and return content
    const generatedContent = response.choices[0].message.content;
    
    console.log("Report generated successfully, length:", generatedContent.length);
    
    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to get the appropriate system prompt based on template type
function getSystemPrompt(templateType: string): string {
  const basePrompt = "Eres un consultor SEO experto que prepara informes detallados para clientes. IMPORTANTE: Escribe todo el informe en español. ";
  
  switch (templateType) {
    case 'seo':
      return basePrompt + "Crea un informe SEO completo con resumen ejecutivo, hallazgos, recomendaciones y estrategia de implementación. Enfócate en problemas técnicos de SEO, calidad de contenido, backlinks, palabras clave y análisis de competencia.";
    
    case 'local':
      return basePrompt + "Crea un informe de SEO local centrado en la optimización de Google Business Profile, citas locales, gestión de reseñas y creación de enlaces locales. Incluye recomendaciones específicas para mejorar la visibilidad en búsquedas locales.";
    
    case 'technical':
      return basePrompt + "Crea una auditoría técnica de SEO centrada en velocidad del sitio, usabilidad móvil, capacidad de rastreo, indexabilidad y problemas técnicos. Incluye explicaciones detalladas y correcciones priorizadas.";
    
    case 'performance':
      return basePrompt + "Crea un informe de rendimiento del sitio web centrado en Core Web Vitals, velocidad de página, métricas de experiencia de usuario y optimización del rendimiento. Incluye recomendaciones específicas para mejorar.";
    
    default:
      return basePrompt + "Crea un informe SEO completo con resumen ejecutivo, hallazgos y recomendaciones accionables. Asegúrate de que todo el contenido esté en español.";
  }
}
