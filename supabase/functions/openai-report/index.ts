
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
    const { auditResult } = await req.json();

    if (!auditResult) {
      return new Response(
        JSON.stringify({ error: 'Invalid request. Missing auditResult.' }),
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

    // Preparar el prompt para OpenAI con instrucciones detalladas
    const systemPrompt = `Eres un consultor SEO experto especializado en crear informes profesionales para clientes. 
Genera un informe SEO detallado en español basado en los datos proporcionados.
El informe debe tener un formato profesional y estar estructurado en estas secciones:

1. Introducción personalizada
2. Análisis de la situación actual con métricas
3. Análisis de palabras clave
4. SEO Local (si hay datos disponibles)
5. Recomendaciones técnicas
6. Estrategia de contenidos
7. Plan de acción y timeline
8. Conclusiones

Usa formato Markdown para estructurar el informe. Sé conciso pero detallado y profesional.`;

    console.log("Enviando solicitud a OpenAI API");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Usando un modelo más rápido y económico
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Genera un informe SEO profesional y detallado basado en estos datos de auditoría: ${JSON.stringify(auditResult, null, 2)}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,  // Permitimos más tokens para un informe más detallado
      }),
    });

    const data = await response.json();
    console.log("Respuesta recibida de OpenAI API");
    
    if (data.error) {
      console.error('Error de OpenAI API:', data.error);
      throw new Error(`Error de OpenAI API: ${data.error.message}`);
    }

    const content = data.choices[0].message.content;
    console.log("Contenido generado exitosamente");

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
      JSON.stringify({ error: error.message }),
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
