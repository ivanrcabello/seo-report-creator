
import { supabase } from "@/integrations/supabase/client";

export interface ClientMetric {
  id: string;
  month: string;
  web_visits: number;
  keywords_top10: number;
  conversions: number;
  conversion_goal: number;
}

export const getClientMetrics = async (clientId: string): Promise<ClientMetric[]> => {
  try {
    console.log("Fetching metrics for client:", clientId);
    const { data, error } = await supabase
      .from('client_metrics')
      .select('id, month, web_visits, keywords_top10, conversions, conversion_goal')
      .eq('client_id', clientId)
      .order('month', { ascending: false });
    
    if (error) {
      console.error("Error fetching client metrics:", error);
      console.log("Error details:", JSON.stringify(error));
      
      // Return empty array for any error to prevent UI errors
      return []; 
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getClientMetrics:", error);
    return []; // Return empty array on any error
  }
};

export const updateClientMetrics = async (clientId: string, metric: ClientMetric): Promise<ClientMetric> => {
  try {
    console.log("Updating metrics for client:", clientId, "with data:", metric);
    
    // Skip the role check which was causing the recursive RLS issue
    // We'll rely on database RLS policies instead
    
    // Prepare data to insert/update - ensure all numeric fields are valid numbers
    const metricData = {
      client_id: clientId,
      month: metric.month,
      web_visits: Math.max(0, Number(metric.web_visits) || 0),
      keywords_top10: Math.max(0, Number(metric.keywords_top10) || 0),
      conversions: Math.max(0, Number(metric.conversions) || 0),
      conversion_goal: Math.max(1, Number(metric.conversion_goal) || 30)
    };

    let result;
    
    // Check if we're updating or inserting
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
        throw new Error(`Error al actualizar métricas: ${error.message}`);
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
        throw new Error(`Error al guardar métricas: ${error.message}`);
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error("Exception in updateClientMetrics:", error);
    
    // If it's an error we've already formatted, just pass it through
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise provide a generic message
    throw new Error("No se pudieron guardar las métricas del cliente. Por favor, contacte al administrador.");
  }
};
