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
    
    // Call the RPC function directly
    const { data, error } = await supabase
      .rpc('get_client_metrics', { client_id_param: clientId });
    
    if (error) {
      console.error("Error fetching client metrics:", error);
      console.log("Error details:", JSON.stringify(error));
      throw new Error(`Error fetching metrics: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getClientMetrics:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

export const updateClientMetrics = async (clientId: string, metric: ClientMetric): Promise<ClientMetric> => {
  try {
    console.log("Updating metrics for client:", clientId, "with data:", metric);
    
    // Prepare data to insert/update - ensure all numeric fields are valid numbers
    const metricData = {
      web_visits: Math.max(0, Number(metric.web_visits) || 0),
      keywords_top10: Math.max(0, Number(metric.keywords_top10) || 0),
      conversions: Math.max(0, Number(metric.conversions) || 0),
      conversion_goal: Math.max(1, Number(metric.conversion_goal) || 30)
    };
    
    let result;
    
    if (metric.id && metric.id.trim() !== '') {
      // Update existing metric
      const { data, error } = await supabase
        .rpc('update_client_metric', {
          p_id: metric.id,
          p_client_id: clientId,
          p_month: metric.month,
          p_web_visits: metricData.web_visits,
          p_keywords_top10: metricData.keywords_top10,
          p_conversions: metricData.conversions,
          p_conversion_goal: metricData.conversion_goal
        });
      
      if (error) {
        console.error("Error updating client metric:", error);
        console.log("Error details:", JSON.stringify(error));
        throw new Error(`Error al actualizar métricas: ${error.message}`);
      }
      
      // Fetch the updated record
      const { data: updatedData, error: fetchError } = await supabase
        .from('client_metrics')
        .select('*')
        .eq('id', metric.id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching updated metric:", fetchError);
        throw new Error(`Error al obtener métricas actualizadas: ${fetchError.message}`);
      }
      
      result = updatedData;
    } else {
      // Insert a new metric
      const { data, error } = await supabase
        .rpc('insert_client_metric', {
          p_client_id: clientId,
          p_month: metric.month,
          p_web_visits: metricData.web_visits,
          p_keywords_top10: metricData.keywords_top10,
          p_conversions: metricData.conversions,
          p_conversion_goal: metricData.conversion_goal
        });
      
      if (error) {
        console.error("Error inserting client metric:", error);
        console.log("Error details:", JSON.stringify(error));
        throw new Error(`Error al guardar métricas: ${error.message}`);
      }
      
      // Find the newly inserted record by client_id and month
      const { data: newData, error: fetchError } = await supabase
        .from('client_metrics')
        .select('*')
        .eq('client_id', clientId)
        .eq('month', metric.month)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (fetchError) {
        console.error("Error fetching new metric:", fetchError);
        throw new Error(`Error al obtener nueva métrica: ${fetchError.message}`);
      }
      
      result = newData;
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
