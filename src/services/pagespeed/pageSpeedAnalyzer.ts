
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageSpeedMetrics, PageSpeedAuditItem, PageSpeedReport } from "./types";

/**
 * Analiza una URL utilizando la API de PageSpeed Insights
 * @param url URL a analizar
 * @returns Datos del análisis
 */
export const analyzePageSpeed = async (url: string): Promise<PageSpeedReport | null> => {
  try {
    console.log("Analizando URL con PageSpeed:", url);
    
    if (!url) {
      toast.error("Por favor, ingresa una URL válida");
      return null;
    }
    
    // Validar que la URL tenga formato correcto con protocolo
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Enviar solicitud a la API de PageSpeed a través de nuestro backend
    const { data, error } = await supabase.functions.invoke('pagespeed-analyze', {
      body: { url }
    });
    
    if (error) {
      console.error("Error al analizar PageSpeed:", error);
      throw new Error(`Error al analizar la página: ${error.message}`);
    }
    
    if (!data || !data.lighthouseResult) {
      throw new Error("No se recibieron datos válidos del análisis");
    }
    
    // Extraer métricas principales
    const result = data.lighthouseResult;
    const categories = result.categories;
    
    // Obtener puntuaciones de categorías
    const performance_score = categories.performance?.score || 0;
    const accessibility_score = categories.accessibility?.score || 0;
    const best_practices_score = categories['best-practices']?.score || 0;
    const seo_score = categories.seo?.score || 0;
    
    // Obtener métricas principales
    const audits = result.audits;
    const first_contentful_paint = audits['first-contentful-paint']?.numericValue / 1000 || 0;
    const speed_index = audits['speed-index']?.numericValue / 1000 || 0;
    const largest_contentful_paint = audits['largest-contentful-paint']?.numericValue / 1000 || 0;
    const time_to_interactive = audits['interactive']?.numericValue / 1000 || 0;
    const total_blocking_time = audits['total-blocking-time']?.numericValue || 0;
    const cumulative_layout_shift = audits['cumulative-layout-shift']?.numericValue || 0;
    
    // Estructurar las métricas
    const metrics: PageSpeedMetrics = {
      url,
      performance_score,
      accessibility_score,
      best_practices_score,
      seo_score,
      first_contentful_paint,
      speed_index,
      largest_contentful_paint,
      time_to_interactive,
      total_blocking_time,
      cumulative_layout_shift,
      timestamp: new Date().toISOString()
    };
    
    // Extraer auditorías para cada categoría
    const auditItems: PageSpeedAuditItem[] = [];
    
    // Recorrer todas las auditorías y agregar las relevantes
    for (const [id, audit] of Object.entries(audits)) {
      if (audit.score !== null && typeof audit.score !== 'undefined') {
        // Determinar a qué categoría pertenece cada auditoría
        let category = '';
        
        if (result.categoryGroups[audit.group]) {
          category = result.categoryGroups[audit.group].title;
        }
        
        auditItems.push({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          category
        });
      }
    }
    
    // Ordenar auditorías por puntuación (de menor a mayor)
    auditItems.sort((a, b) => a.score - b.score);
    
    // Crear objeto completo de informe
    const report: PageSpeedReport = {
      metrics,
      auditItems,
      fullReport: data
    };
    
    console.log("Análisis PageSpeed completado con éxito");
    return report;
    
  } catch (error) {
    console.error("Error en análisis PageSpeed:", error);
    let errorMessage = "Error al analizar la página";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    throw error;
  }
};
