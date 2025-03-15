
import { supabase } from "@/integrations/supabase/client";

interface ClientMetric {
  id: string;
  month: string;
  web_visits: number;
  keywords_top10: number;
  conversions: number;
  conversion_goal: number;
}

export const getClientMetrics = async (clientId: string): Promise<ClientMetric[]> => {
  try {
    // Use a direct query approach
    const { data, error } = await supabase
      .from('client_metrics')
      .select('id, month, web_visits, keywords_top10, conversions, conversion_goal')
      .eq('client_id', clientId)
      .order('month', { ascending: false });
    
    if (error) {
      console.error("Error fetching client metrics:", error);
      return []; // Return empty array instead of throwing
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching client metrics:", error);
    return []; // Return empty array on any error
  }
};

export const updateClientMetrics = async (clientId: string, metric: ClientMetric): Promise<ClientMetric> => {
  try {
    // Ensure all values are properly formatted
    const metricData = {
      client_id: clientId,
      month: metric.month,
      web_visits: Number(metric.web_visits) || 0,
      keywords_top10: Number(metric.keywords_top10) || 0,
      conversions: Number(metric.conversions) || 0,
      conversion_goal: Number(metric.conversion_goal) || 30
    };

    // Check if metric has an ID for update or insert
    if (metric.id && metric.id.trim() !== '') {
      // Update existing metric
      const { data, error } = await supabase
        .from('client_metrics')
        .update(metricData)
        .eq('id', metric.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating client metric:", error);
        throw error;
      }
      
      return data;
    } else {
      // Insert a new metric
      const { data, error } = await supabase
        .from('client_metrics')
        .insert(metricData)
        .select()
        .single();
      
      if (error) {
        console.error("Error inserting client metric:", error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Error in updateClientMetrics:", error);
    throw new Error("Failed to save client metrics");
  }
};
