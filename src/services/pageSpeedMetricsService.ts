import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageSpeedReport } from "@/services/pagespeed";

export interface PageSpeedMetric {
  id: string;
  client_id: string;
  url: string;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  created_at: string;
  updated_at: string;
}

/**
 * Saves PageSpeed metrics to a separate table for metrics tracking
 */
export const savePageSpeedMetrics = async (
  clientId: string,
  report: PageSpeedReport
): Promise<boolean> => {
  try {
    const metrics = report.metrics;
    
    if (!metrics) {
      console.error("No metrics found in report");
      return false;
    }
    
    // Ensure we store scores as decimal values (0-1) not percentages
    const metricsData = {
      client_id: clientId,
      url: metrics.url,
      performance_score: parseFloat(metrics.performance_score.toString()),
      accessibility_score: parseFloat(metrics.accessibility_score.toString()),
      best_practices_score: parseFloat(metrics.best_practices_score.toString()),
      seo_score: parseFloat(metrics.seo_score.toString())
    };
    
    console.log("Saving PageSpeed metrics:", metricsData);
    
    const { error } = await supabase
      .from('pagespeed_metrics')
      .insert([metricsData]);
    
    if (error) {
      console.error("Error saving PageSpeed metrics:", error);
      toast.error("Error al guardar métricas de PageSpeed");
      return false;
    }
    
    console.log("PageSpeed metrics saved successfully");
    return true;
  } catch (error) {
    console.error("Exception saving PageSpeed metrics:", error);
    return false;
  }
};

/**
 * Gets historical PageSpeed metrics for a client
 */
export const getPageSpeedMetrics = async (
  clientId: string
): Promise<PageSpeedMetric[]> => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching PageSpeed metrics:", error);
      toast.error("Error al obtener métricas de PageSpeed");
      return [];
    }
    
    return data as PageSpeedMetric[];
  } catch (error) {
    console.error("Exception fetching PageSpeed metrics:", error);
    return [];
  }
};
