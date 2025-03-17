
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OPENAI_API_KEY env var not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed successfully");
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { auditResult, templateType = 'seo' } = body;

    if (!auditResult) {
      console.error("Missing audit result in request");
      return new Response(
        JSON.stringify({ error: 'Audit result is required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log("Datos de auditoría recibidos:", JSON.stringify(auditResult).slice(0, 200) + "...");
    console.log("Template type:", templateType);

    // Preparar el prompt según el tipo de informe
    let systemPrompt = "";
    
    if (templateType === 'seo') {
      systemPrompt = `Eres un consultor SEO experto especializado en crear informes profesionales para clientes. 
Genera un informe SEO detallado en español basado en los datos proporcionados.
El informe debe tener un formato profesional y estar estructurado en estas secciones:

1. Introducción personalizada
2. Análisis de la situación actual con métricas
3. Análisis de palabras clave
4. SEO técnico
5. Recomendaciones prioritarias
6. Estrategia de contenidos
7. Plan de acción y timeline
8. Conclusiones

Usa formato Markdown para estructurar el informe. Sé conciso pero detallado y profesional.`;
    } else if (templateType === 'local') {
      systemPrompt = `Eres un consultor de SEO Local experto especializado en crear informes profesionales para clientes.
Genera un informe de SEO Local detallado en español basado en los datos proporcionados.
El informe debe tener un formato profesional y estar estructurado en estas secciones:

1. Introducción personalizada
2. Análisis de Google My Business
3. Análisis de reseñas y reputación
4. Análisis de directorios locales
5. Análisis de competidores locales
6. Recomendaciones prioritarias
7. Plan de acción y timeline
8. Conclusiones

Usa formato Markdown para estructurar el informe. Sé conciso pero detallado y profesional.`;
    } else if (templateType === 'technical') {
      systemPrompt = `Eres un consultor SEO técnico experto especializado en crear informes profesionales para clientes.
Genera un informe de SEO técnico detallado en español basado en los datos proporcionados.
El informe debe tener un formato profesional y estar estructurado en estas secciones:

1. Introducción personalizada
2. Análisis de rendimiento técnico
3. Análisis de errores y problemas críticos
4. Análisis de arquitectura web
5. Análisis de seguridad
6. Recomendaciones prioritarias
7. Plan de acción y timeline
8. Conclusiones

Usa formato Markdown para estructurar el informe. Sé conciso pero detallado y profesional.`;
    } else if (templateType === 'performance') {
      systemPrompt = `Eres un consultor de rendimiento web experto especializado en crear informes profesionales para clientes.
Genera un informe de rendimiento web detallado en español basado en los datos proporcionados.
El informe debe tener un formato profesional y estar estructurado en estas secciones:

1. Introducción personalizada
2. Análisis de Core Web Vitals
3. Análisis de velocidad de carga
4. Análisis de elementos que bloquean el renderizado
5. Optimización de recursos
6. Recomendaciones prioritarias
7. Plan de acción y timeline
8. Conclusiones

Usa formato Markdown para estructurar el informe. Sé conciso pero detallado y profesional.`;
    }

    console.log("Enviando solicitud a OpenAI API");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Modelo más rápido y económico
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Genera un informe profesional y detallado basado en estos datos de auditoría: ${JSON.stringify(auditResult, null, 2)}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,  // Permitimos más tokens para un informe más detallado
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`Error en la API de OpenAI: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta recibida de OpenAI API");
    
    if (data.error) {
      console.error('Error de OpenAI API:', data.error);
      throw new Error(`Error de OpenAI API: ${data.error.message}`);
    }

    const content = data.choices[0].message.content;
    console.log("Contenido generado exitosamente, longitud:", content.length);

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error en la función openai-report:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        details: error instanceof Error && error.stack ? error.stack : 'No stack available' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
