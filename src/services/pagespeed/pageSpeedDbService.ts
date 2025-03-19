
import { supabase } from "@/integrations/supabase/client";
import { PageSpeedMetrics, PageSpeedReport } from "./types";
import { toast } from "sonner";

/**
 * Guarda los resultados de análisis de PageSpeed en la base de datos
 * @param clientId ID del cliente
 * @param report Informe completo de PageSpeed
 * @returns true si se guardó correctamente
 */
export const savePageSpeedResults = async (
  clientId: string,
  report: PageSpeedReport
): Promise<boolean> => {
  try {
    console.log("Guardando resultados de PageSpeed para cliente:", clientId);
    
    if (!report || !report.metrics) {
      console.error("Error: No hay métricas de PageSpeed para guardar");
      throw new Error("No hay datos válidos para guardar");
    }
    
    // Extraer las métricas principales
    const metrics = report.metrics;
    
    // Preparar los datos para guardar
    const dataToSave = {
      client_id: clientId,
      url: metrics.url,
      performance_score: metrics.performance_score,
      accessibility_score: metrics.accessibility_score,
      best_practices_score: metrics.best_practices_score,
      seo_score: metrics.seo_score,
      first_contentful_paint: metrics.first_contentful_paint,
      speed_index: metrics.speed_index,
      largest_contentful_paint: metrics.largest_contentful_paint,
      time_to_interactive: metrics.time_to_interactive,
      total_blocking_time: metrics.total_blocking_time,
      cumulative_layout_shift: metrics.cumulative_layout_shift,
      created_at: new Date().toISOString(),
      full_report: report.fullReport, // Guardar el informe completo por si se necesita después
      audit_items: report.auditItems // Guardar los elementos de auditoría
    };
    
    console.log("Guardando datos de PageSpeed en client_pagespeed");
    
    // Insertar en la tabla client_pagespeed
    const { data, error } = await supabase
      .from('client_pagespeed')
      .insert([dataToSave])
      .select();
    
    if (error) {
      console.error("Error al guardar resultados de PageSpeed:", error);
      throw new Error(`Error al guardar resultados: ${error.message}`);
    }
    
    console.log("Resultados de PageSpeed guardados correctamente:", data);
    return true;
  } catch (error) {
    console.error("Error al guardar resultados de PageSpeed:", error);
    let errorMessage = "No se pudieron guardar los resultados del análisis";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return false;
  }
};

/**
 * Elimina un análisis de PageSpeed de la base de datos
 * @param metricId ID de la métrica a eliminar
 * @returns true si se eliminó correctamente
 */
export const deletePageSpeedMetric = async (metricId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_pagespeed')
      .delete()
      .eq('id', metricId);
    
    if (error) {
      throw new Error(`Error al eliminar la métrica: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error al eliminar métrica de PageSpeed:", error);
    let errorMessage = "No se pudo eliminar la métrica";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return false;
  }
};
