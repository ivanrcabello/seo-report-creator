
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../cors.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

// Set up OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY") || "",
});

// Get the model to use from environment variables or use default
const MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("OpenAI report generation function called");
    
    const { auditResult, templateType, customPrompt } = await req.json();
    
    if (!auditResult) {
      console.error("Missing audit result data");
      return new Response(
        JSON.stringify({ error: "Missing audit result data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Generating OpenAI report with model:", MODEL);
    console.log("Template type:", templateType);
    console.log("Company name:", auditResult.companyName);
    console.log("Has custom prompt:", !!customPrompt);
    
    // Create base system prompt based on template type
    let systemPrompt = "";
    
    switch (templateType) {
      case "seo":
        systemPrompt = `Eres un consultor SEO experto que está generando un informe detallado para un cliente. 
        Utiliza el análisis proporcionado para crear un informe completo de SEO para la empresa "${auditResult.companyName}".
        El informe debe estar bien estructurado, profesional y utilizar los datos proporcionados para ofrecer información valiosa y recomendaciones prácticas.`;
        break;
      case "local":
        systemPrompt = `Eres un consultor de SEO Local experto que está generando un informe detallado para un negocio local. 
        Utiliza el análisis proporcionado para crear un informe completo de SEO Local para "${auditResult.companyName}".
        Enfócate en presencia en Google Maps, reseñas de Google Business, optimización de la ficha de Google Business, 
        y estrategias para mejorar la visibilidad local en los resultados de búsqueda.`;
        break;
      case "technical":
        systemPrompt = `Eres un consultor de SEO Técnico experto que está generando un informe detallado para un cliente. 
        Utiliza el análisis proporcionado para crear un informe completo de SEO Técnico para la empresa "${auditResult.companyName}".
        Enfócate en problemas técnicos del sitio web, velocidad de carga, seguridad, estructura, errores de rastreo, 
        redirecciones, implementación de schema markup, y otras optimizaciones técnicas.`;
        break;
      case "performance":
        systemPrompt = `Eres un consultor de Rendimiento Web experto que está generando un informe detallado para un cliente. 
        Utiliza el análisis proporcionado para crear un informe completo de rendimiento web para la empresa "${auditResult.companyName}".
        Enfócate en métricas de Core Web Vitals, velocidad de carga, optimización de imágenes, minificación de recursos, 
        y otras estrategias para mejorar el rendimiento del sitio web.`;
        break;
      default:
        systemPrompt = `Eres un consultor SEO experto que está generando un informe detallado para un cliente. 
        Utiliza el análisis proporcionado para crear un informe completo para la empresa "${auditResult.companyName}".`;
    }
    
    // Append custom prompt if provided
    if (customPrompt && customPrompt.trim().length > 0) {
      systemPrompt += `\n\nInstrucciones adicionales: ${customPrompt}`;
    }
    
    // Add report structure guidelines
    systemPrompt += `\n\nEstructura tu informe con los siguientes apartados:
      1. Resumen Ejecutivo
      2. Análisis de la Situación Actual
      3. Puntos Fuertes y Oportunidades
      4. Problemas Detectados
      5. Recomendaciones Específicas
      6. Plan de Acción Propuesto
      
    Utiliza formato Markdown para estructurar el informe con encabezados, listas y énfasis. No incluyas ningún código HTML.`;
    
    console.log("System prompt prepared. Calling OpenAI API...");
    
    // Call OpenAI API to generate report
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Genera un informe profesional basado en estos datos de análisis: ${JSON.stringify(auditResult)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    const content = completion.choices[0]?.message?.content || "";
    
    console.log("OpenAI response received successfully");
    console.log("Content length:", content.length);
    console.log("Content preview:", content.substring(0, 100) + "...");
    
    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in OpenAI report generation:", error);
    
    return new Response(
      JSON.stringify({ 
        error: `Error generating report: ${error.message || "Unknown error"}`,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
