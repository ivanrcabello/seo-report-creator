
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
    // Simplified query with more detailed error logging
    const { data, error } = await supabase
      .from('client_metrics')
      .select('id, month, web_visits, keywords_top10, conversions, conversion_goal')
      .eq('client_id', clientId)
      .order('month', { ascending: false });
    
    if (error) {
      console.error("Error fetching client metrics:", error);
      console.log("Error details:", JSON.stringify(error));
      return []; // Return empty array instead of throwing
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getClientMetrics:", error);
    return []; // Return empty array on any error
  }
};

export const updateClientMetrics = async (clientId: string, metric: ClientMetric): Promise<ClientMetric> => {
  try {
    // Clean and validate all values before saving
    const metricData = {
      client_id: clientId,
      month: metric.month,
      web_visits: Math.max(0, Number(metric.web_visits) || 0),
      keywords_top10: Math.max(0, Number(metric.keywords_top10) || 0),
      conversions: Math.max(0, Number(metric.conversions) || 0),
      conversion_goal: Math.max(1, Number(metric.conversion_goal) || 30)
    };

    let result;
    
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
        console.log("Error details:", JSON.stringify(error));
        throw error;
      }
      
      result = data;
    } else {
      // Insert a new metric
      const { data, error } = await supabase
        .from('client_metrics')
        .insert(metricData)
        .select()
        .single();
      
      if (error) {
        console.error("Error inserting client metric:", error);
        console.log("Error details:", JSON.stringify(error));
        throw error;
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error("Exception in updateClientMetrics:", error);
    console.log("Error details:", error.message);
    
    if (error.message && error.message.includes("infinite recursion")) {
      throw new Error("Error de acceso a la base de datos. Contacte al administrador del sistema.");
    }
    
    throw new Error("No se pudieron guardar las métricas del cliente");
  }
};
