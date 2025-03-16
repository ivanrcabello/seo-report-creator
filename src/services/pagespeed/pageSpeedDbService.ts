
import { supabase } from "@/integrations/supabase/client";
import { PageSpeedReport } from "./types";
import { toast } from "sonner";

export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    console.log("Saving PageSpeed report for client:", clientId);
    
    // Convertir todas las métricas a números para asegurar consistencia de tipos
    const metrics = { ...report.metrics };
    
    // Preparar datos para la tabla pagespeed_metrics
    // Importante: Multiplicar las puntuaciones decimales por 100 para almacenarlas como enteros
    const metricsData = {
      client_id: clientId,
      url: metrics.url,
      performance_score: Math.round(Number(metrics.performance_score) * 100),
      seo_score: Math.round(Number(metrics.seo_score) * 100),
      best_practices_score: Math.round(Number(metrics.best_practices_score) * 100),
      accessibility_score: Math.round(Number(metrics.accessibility_score) * 100),
      first_contentful_paint: Number(metrics.first_contentful_paint),
      speed_index: Number(metrics.speed_index),
      largest_contentful_paint: Number(metrics.largest_contentful_paint),
      time_to_interactive: Number(metrics.time_to_interactive),
      total_blocking_time: Number(metrics.total_blocking_time),
      cumulative_layout_shift: Number(metrics.cumulative_layout_shift),
      created_at: new Date().toISOString()
    };
    
    console.log("Metrics data to be saved:", metricsData);
    
    // Insertar en pagespeed_metrics
    const { data: metricsResult, error: metricsError } = await supabase
      .from('pagespeed_metrics')
      .insert([metricsData])
      .select();
    
    if (metricsError) {
      console.error("Error saving PageSpeed metrics:", metricsError);
      toast.error("Error al guardar las métricas de PageSpeed");
      return false;
    }
    
    if (!metricsResult || metricsResult.length === 0) {
      console.error("No metrics data returned after insert");
      toast.error("Error al guardar las métricas de PageSpeed");
      return false;
    }
    
    const metricId = metricsResult[0].id;
    console.log("PageSpeed metrics saved with ID:", metricId);
    
    // También almacenar en client_pagespeed con audits incluidos
    // De nuevo, multiplicar puntuaciones decimales por 100 para almacenarlas como enteros
    try {
      const pagespeedData = {
        client_id: clientId,
        url: metrics.url,
        performance_score: Math.round(Number(metrics.performance_score) * 100),
        accessibility_score: Math.round(Number(metrics.accessibility_score) * 100),
        best_practices_score: Math.round(Number(metrics.best_practices_score) * 100),
        seo_score: Math.round(Number(metrics.seo_score) * 100),
        first_contentful_paint: Number(metrics.first_contentful_paint),
        speed_index: Number(metrics.speed_index),
        largest_contentful_paint: Number(metrics.largest_contentful_paint),
        time_to_interactive: Number(metrics.time_to_interactive),
        total_blocking_time: Number(metrics.total_blocking_time),
        cumulative_layout_shift: Number(metrics.cumulative_layout_shift),
        audits: JSON.stringify(report.audits), // Convertir a string JSON antes de almacenar
        created_at: new Date().toISOString()
      };
      
      // Insertar en client_pagespeed
      const { error: reportError } = await supabase
        .from('client_pagespeed')
        .insert([pagespeedData]);
      
      if (reportError) {
        console.error("Error saving PageSpeed report:", reportError);
        // Aunque falle esta parte, ya hemos guardado las métricas principales
        console.log("Falling back to metrics-only storage");
        return true;
      }
    } catch (err) {
      console.error("Error in second insert (client_pagespeed):", err);
      // Si falla la segunda inserción, todavía consideramos exitoso el guardado
      // ya que las métricas principales están guardadas
      return true;
    }
    
    console.log("PageSpeed report saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving PageSpeed report:", error);
    toast.error("Error al guardar el informe de PageSpeed");
    return false;
  }
};

export const getPageSpeedReport = async (clientId: string): Promise<PageSpeedReport | null> => {
  try {
    console.log("Getting PageSpeed report for client:", clientId);
    
    // Obtener el registro más reciente de client_pagespeed que incluye audits
    const { data: pagespeedData, error: pagespeedError } = await supabase
      .from('client_pagespeed')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (pagespeedError || !pagespeedData || pagespeedData.length === 0) {
      console.error("Error getting PageSpeed data:", pagespeedError);
      return await getLatestMetricsAsReport(clientId);
    }
    
    const data = pagespeedData[0];
    console.log("PageSpeed data found:", data);
    
    // Construir el informe
    // Importante: Dividir puntuaciones enteras por 100 para convertirlas de vuelta a decimales (0-1)
    const report: PageSpeedReport = {
      id: data.id,
      metrics: {
        url: data.url,
        performance_score: Number(data.performance_score) / 100,
        seo_score: Number(data.seo_score) / 100,
        best_practices_score: Number(data.best_practices_score) / 100,
        accessibility_score: Number(data.accessibility_score) / 100,
        first_contentful_paint: Number(data.first_contentful_paint),
        speed_index: Number(data.speed_index),
        largest_contentful_paint: Number(data.largest_contentful_paint),
        time_to_interactive: Number(data.time_to_interactive),
        total_blocking_time: Number(data.total_blocking_time),
        cumulative_layout_shift: Number(data.cumulative_layout_shift)
      },
      audits: Array.isArray(data.audits) ? data.audits : 
              (typeof data.audits === 'string' ? JSON.parse(data.audits) : []),
      created_at: data.created_at
    };
    
    return report;
  } catch (error) {
    console.error("Error getting PageSpeed report:", error);
    return null;
  }
};

// Función auxiliar para obtener las métricas más recientes como informe
const getLatestMetricsAsReport = async (clientId: string): Promise<PageSpeedReport | null> => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.error("Error getting PageSpeed metrics:", error);
      return null;
    }
    
    const metricData = data[0];
    // Dividir puntuaciones enteras por 100 para convertirlas de vuelta a decimales (0-1)
    return {
      id: metricData.id,
      metrics: {
        url: metricData.url,
        performance_score: Number(metricData.performance_score) / 100,
        seo_score: Number(metricData.seo_score) / 100,
        best_practices_score: Number(metricData.best_practices_score) / 100,
        accessibility_score: Number(metricData.accessibility_score) / 100,
        first_contentful_paint: Number(metricData.first_contentful_paint),
        speed_index: Number(metricData.speed_index),
        largest_contentful_paint: Number(metricData.largest_contentful_paint),
        time_to_interactive: Number(metricData.time_to_interactive),
        total_blocking_time: Number(metricData.total_blocking_time),
        cumulative_layout_shift: Number(metricData.cumulative_layout_shift)
      },
      audits: [],
      created_at: metricData.created_at
    };
  } catch (error) {
    console.error("Error in getLatestMetricsAsReport:", error);
    return null;
  }
};

export const getPageSpeedMetrics = async (clientId: string, limit = 10): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error getting PageSpeed metrics:", error);
      return [];
    }
    
    // Mapear los datos para convertir las puntuaciones de enteros a decimales (0-1)
    const mappedData = data?.map(item => ({
      ...item,
      performance_score: Number(item.performance_score) / 100,
      accessibility_score: Number(item.accessibility_score) / 100,
      best_practices_score: Number(item.best_practices_score) / 100,
      seo_score: Number(item.seo_score) / 100
    })) || [];
    
    return mappedData;
  } catch (error) {
    console.error("Error getting PageSpeed metrics:", error);
    return [];
  }
};
