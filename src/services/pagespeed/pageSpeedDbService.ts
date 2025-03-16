
import { supabase } from "@/integrations/supabase/client";
import { PageSpeedReport, PageSpeedAudit } from "../pagespeed";
import { toast } from "sonner";

export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    console.log("Saving PageSpeed report for client:", clientId);
    
    // Asegurar que todas las métricas son números
    const metrics = { ...report.metrics };
    Object.keys(metrics).forEach(key => {
      if (typeof metrics[key] === 'string' && !isNaN(Number(metrics[key]))) {
        metrics[key] = Number(metrics[key]);
      }
    });
    
    // Preparar datos para la tabla pagespeed_metrics
    const metricsData = {
      client_id: clientId,
      url: metrics.url,
      performance_score: Number(metrics.performance_score),
      seo_score: Number(metrics.seo_score),
      best_practices_score: Number(metrics.best_practices_score),
      accessibility_score: Number(metrics.accessibility_score),
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
    
    // También almacenar audits en la tabla client_pagespeed
    const pagespeedData = {
      client_id: clientId,
      url: metrics.url,
      performance_score: Number(metrics.performance_score),
      accessibility_score: Number(metrics.accessibility_score),
      best_practices_score: Number(metrics.best_practices_score),
      seo_score: Number(metrics.seo_score),
      first_contentful_paint: Number(metrics.first_contentful_paint),
      speed_index: Number(metrics.speed_index),
      largest_contentful_paint: Number(metrics.largest_contentful_paint),
      time_to_interactive: Number(metrics.time_to_interactive),
      total_blocking_time: Number(metrics.total_blocking_time),
      cumulative_layout_shift: Number(metrics.cumulative_layout_shift),
      audits: report.audits,
      created_at: new Date().toISOString()
    };
    
    // Insertar en client_pagespeed
    const { error: reportError } = await supabase
      .from('client_pagespeed')
      .insert([pagespeedData]);
    
    if (reportError) {
      console.error("Error saving PageSpeed report:", reportError);
      toast.error("Error al guardar el informe de PageSpeed");
      return false;
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
    
    // Primero, obtener los últimos datos de PageSpeed de client_pagespeed que incluye audits
    const { data: pagespeedData, error: pagespeedError } = await supabase
      .from('client_pagespeed')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (pagespeedError) {
      console.error("Error getting PageSpeed data:", pagespeedError);
      
      // Intentar obtener solo las métricas si no hay datos completos
      return await getLatestMetricsAsReport(clientId);
    }
    
    if (!pagespeedData) {
      console.log("No PageSpeed data found for client:", clientId);
      return null;
    }
    
    console.log("PageSpeed data found:", pagespeedData);
    
    // Construir el reporte a partir de los datos obtenidos
    const report: PageSpeedReport = {
      id: pagespeedData.id,
      metrics: {
        url: pagespeedData.url,
        performance_score: Number(pagespeedData.performance_score),
        seo_score: Number(pagespeedData.seo_score),
        best_practices_score: Number(pagespeedData.best_practices_score),
        accessibility_score: Number(pagespeedData.accessibility_score),
        first_contentful_paint: Number(pagespeedData.first_contentful_paint),
        speed_index: Number(pagespeedData.speed_index),
        largest_contentful_paint: Number(pagespeedData.largest_contentful_paint),
        time_to_interactive: Number(pagespeedData.time_to_interactive),
        total_blocking_time: Number(pagespeedData.total_blocking_time),
        cumulative_layout_shift: Number(pagespeedData.cumulative_layout_shift)
      },
      audits: Array.isArray(pagespeedData.audits) ? pagespeedData.audits : [],
      created_at: pagespeedData.created_at
    };
    
    return report;
  } catch (error) {
    console.error("Error getting PageSpeed report:", error);
    return null;
  }
};

// Función auxiliar para obtener el último reporte basado solo en métricas
const getLatestMetricsAsReport = async (clientId: string): Promise<PageSpeedReport | null> => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error getting PageSpeed metrics:", error);
      return null;
    }
    
    return {
      id: data.id,
      metrics: {
        url: data.url,
        performance_score: Number(data.performance_score),
        seo_score: Number(data.seo_score),
        best_practices_score: Number(data.best_practices_score),
        accessibility_score: Number(data.accessibility_score),
        first_contentful_paint: Number(data.first_contentful_paint),
        speed_index: Number(data.speed_index),
        largest_contentful_paint: Number(data.largest_contentful_paint),
        time_to_interactive: Number(data.time_to_interactive),
        total_blocking_time: Number(data.total_blocking_time),
        cumulative_layout_shift: Number(data.cumulative_layout_shift)
      },
      audits: [],
      created_at: data.created_at
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
    
    return data || [];
  } catch (error) {
    console.error("Error getting PageSpeed metrics:", error);
    return [];
  }
};
