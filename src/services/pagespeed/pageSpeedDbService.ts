
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
    
    const metricId = metricsResult[0].id;
    
    // Preparar datos para la tabla client_pagespeed
    const reportData = {
      client_id: clientId,
      metric_id: metricId,
      report_data: {
        id: report.id,
        timestamp: report.timestamp,
        url: report.url,
        audits: report.audits
      },
      created_at: new Date().toISOString()
    };
    
    // Insertar en client_pagespeed
    const { error: reportError } = await supabase
      .from('client_pagespeed')
      .insert([reportData]);
    
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
    
    // Obtener el último informe de PageSpeed para el cliente
    const { data, error } = await supabase
      .from('client_pagespeed')
      .select(`
        report_data,
        metrics:metric_id(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error getting PageSpeed report:", error);
      return null;
    }
    
    if (!data) {
      console.log("No PageSpeed report found for client:", clientId);
      return null;
    }
    
    console.log("PageSpeed report found:", data);
    
    // Combinar los datos del informe con las métricas
    const report: PageSpeedReport = {
      id: data.report_data.id,
      timestamp: data.report_data.timestamp,
      url: data.report_data.url,
      audits: data.report_data.audits || [],
      metrics: {
        url: data.metrics.url,
        performance_score: Number(data.metrics.performance_score),
        seo_score: Number(data.metrics.seo_score),
        best_practices_score: Number(data.metrics.best_practices_score),
        accessibility_score: Number(data.metrics.accessibility_score),
        first_contentful_paint: Number(data.metrics.first_contentful_paint),
        speed_index: Number(data.metrics.speed_index),
        largest_contentful_paint: Number(data.metrics.largest_contentful_paint),
        time_to_interactive: Number(data.metrics.time_to_interactive),
        total_blocking_time: Number(data.metrics.total_blocking_time),
        cumulative_layout_shift: Number(data.metrics.cumulative_layout_shift)
      }
    };
    
    return report;
  } catch (error) {
    console.error("Error getting PageSpeed report:", error);
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
