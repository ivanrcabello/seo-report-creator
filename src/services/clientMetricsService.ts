
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
    // Using select * with eq instead of a join that might trigger the recursion issue
    const { data, error } = await supabase
      .from('client_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('month', { ascending: false });
    
    if (error) {
      console.error("Error fetching client metrics:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching client metrics:", error);
    return [];
  }
};

export const updateClientMetrics = async (clientId: string, metric: ClientMetric): Promise<ClientMetric> => {
  try {
    const metricData = {
      client_id: clientId,
      month: metric.month,
      web_visits: metric.web_visits,
      keywords_top10: metric.keywords_top10,
      conversions: metric.conversions,
      conversion_goal: metric.conversion_goal
    };

    // If the metric has an ID, update it; otherwise, insert a new one
    if (metric.id) {
      const { data, error } = await supabase
        .from('client_metrics')
        .update(metricData)
        .eq('id', metric.id)
        .select('*')
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
        .select('*')
        .single();
      
      if (error) {
        console.error("Error inserting client metric:", error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Error updating client metrics:", error);
    throw error;
  }
};
