
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { toast } from "sonner";

// Exportamos todos los servicios de módulos individuales
export * from "./contentService";
export * from "./seoReportService";

// Generar informe SEO usando OpenAI
export const generateSEOReport = async (auditResult: AuditResult): Promise<string | null> => {
  try {
    // Primero verificamos si hay datos suficientes para generar un informe
    if (!auditResult) {
      console.warn("No se proporcionaron datos de auditoría para generar el informe SEO");
      return null;
    }

    console.log("Invocando función Edge para generar informe SEO");
    
    // Añadimos un timeout para evitar que la solicitud se quede colgada
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout al generar el informe")), 30000)
    );
    
    // Realizamos la llamada a la función Edge
    const fetchPromise = supabase.functions.invoke('openai-report', {
      body: { auditResult }
    }).then(response => {
      if (response.error) {
        console.error("Error al invocar función Edge:", response.error);
        throw new Error(response.error.message);
      }
      
      if (!response.data || !response.data.content) {
        throw new Error("No se recibió contenido del informe");
      }
      
      return response.data.content;
    });
    
    // Utilizamos Promise.race para implementar un timeout
    const content = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Si llegamos aquí, la promesa fetchPromise se resolvió antes que el timeout
    console.log("Informe SEO generado correctamente");
    return content;
  } catch (error) {
    console.error("Error generando informe SEO:", error);
    
    // En caso de error con la función Edge, generamos un informe básico
    console.log("Generando informe básico como fallback");
    return generateBasicReport(auditResult);
  }
};

// Función de respaldo para generar un informe básico sin depender de la API externa
const generateBasicReport = (auditResult: AuditResult): string => {
  try {
    return `# Informe SEO para ${auditResult.companyName}

## Resumen Ejecutivo

Este informe presenta un análisis del rendimiento SEO actual de ${auditResult.companyName} y ofrece recomendaciones para mejorar su visibilidad online.

## Análisis de la Situación Actual

### Métricas clave
- **Puntuación SEO**: ${auditResult.seoScore}/100
- **Rendimiento**: ${auditResult.performance}/100
- **Palabras clave monitorizadas**: ${auditResult.keywordsCount}
${auditResult.metrics ? `- **Visitas mensuales**: ${auditResult.metrics.visits}
- **Conversiones**: ${auditResult.metrics.conversions}` : ''}

## Recomendaciones

1. **Optimización técnica**
   - Mejorar velocidad de carga
   - Implementar SSL en todo el sitio
   - Asegurar que el sitio es mobile-friendly

2. **Contenido**
   - Crear contenido original enfocado en palabras clave
   - Optimizar titles y meta descriptions
   - Desarrollar una estrategia de blog

3. **SEO Local**
   - Completar perfil de Google My Business
   - Conseguir más reseñas de clientes
   - Optimizar NAP (Nombre, Dirección, Teléfono)

## Plan de Acción

Recomendamos implementar estas mejoras en los próximos 3 meses para ver resultados significativos en 6 meses.`;
  } catch (error) {
    console.error("Error generando informe básico:", error);
    return `# Informe SEO\n\nNo se ha podido generar el informe completo. Por favor, contacte con soporte.`;
  }
};
