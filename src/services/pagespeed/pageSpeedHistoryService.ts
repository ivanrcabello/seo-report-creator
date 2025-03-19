
import { supabase } from "@/integrations/supabase/client";
import { PageSpeedMetrics } from "./types";
import { toast } from "sonner";

/**
 * Obtiene el historial de análisis de PageSpeed para un cliente
 * @param clientId ID del cliente
 * @returns Array con el historial de métricas
 */
export const getPageSpeedHistory = async (clientId: string): Promise<PageSpeedMetrics[]> => {
  try {
    console.log("Obteniendo historial de PageSpeed para cliente:", clientId);
    
    const { data, error } = await supabase
      .from('client_pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error al obtener historial de PageSpeed:", error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
    
    // Transformar los datos si es necesario
    const metrics: PageSpeedMetrics[] = data.map(item => ({
      url: item.url,
      performance_score: item.performance_score,
      accessibility_score: item.accessibility_score,
      best_practices_score: item.best_practices_score,
      seo_score: item.seo_score,
      first_contentful_paint: item.first_contentful_paint,
      speed_index: item.speed_index,
      largest_contentful_paint: item.largest_contentful_paint,
      time_to_interactive: item.time_to_interactive,
      total_blocking_time: item.total_blocking_time,
      cumulative_layout_shift: item.cumulative_layout_shift,
      timestamp: item.created_at
    }));
    
    return metrics;
  } catch (error) {
    console.error("Error al obtener historial de PageSpeed:", error);
    let errorMessage = "No se pudo cargar el historial de análisis";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return [];
  }
};

/**
 * Obtiene el análisis de PageSpeed más reciente para un cliente
 * @param clientId ID del cliente
 * @returns Datos de la métrica más reciente o null si no hay datos
 */
export const getLatestPageSpeedMetrics = async (clientId: string): Promise<PageSpeedMetrics | null> => {
  try {
    const { data, error } = await supabase
      .from('client_pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not an error for this case
        return null;
      }
      console.error("Error al obtener última métrica de PageSpeed:", error);
      throw new Error(`Error al obtener datos: ${error.message}`);
    }
    
    if (!data) return null;
    
    return {
      url: data.url,
      performance_score: data.performance_score,
      accessibility_score: data.accessibility_score,
      best_practices_score: data.best_practices_score,
      seo_score: data.seo_score,
      first_contentful_paint: data.first_contentful_paint,
      speed_index: data.speed_index,
      largest_contentful_paint: data.largest_contentful_paint,
      time_to_interactive: data.time_to_interactive,
      total_blocking_time: data.total_blocking_time,
      cumulative_layout_shift: data.cumulative_layout_shift,
      timestamp: data.created_at
    };
  } catch (error) {
    console.error("Error al obtener última métrica de PageSpeed:", error);
    return null;
  }
};
