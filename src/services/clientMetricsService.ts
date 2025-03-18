
import { supabase } from "@/integrations/supabase/client";
import logger from "@/services/logService";

// Logger específico para clientMetricsService
const metricsLogger = logger.getLogger('clientMetricsService');

export interface ClientMetric {
  id: string;
  month: string;
  web_visits: number;
  keywords_top10: number;
  conversions: number;
  conversion_goal: number;
}

export const getClientMetrics = async (clientId: string): Promise<ClientMetric[]> => {
  metricsLogger.info(`Solicitando métricas para cliente: ${clientId}`);
  
  try {
    const { data, error } = await supabase
      .rpc('get_client_metrics', { client_id_param: clientId });
    
    if (error) {
      metricsLogger.error("Error al obtener métricas:", error);
      throw error;
    }
    
    metricsLogger.debug(`Datos de métricas recibidos: ${JSON.stringify(data)}`);
    return data || [];
  } catch (error) {
    metricsLogger.error("Excepción al obtener métricas de cliente:", error);
    throw error;
  }
};

// Función para agregar nueva métrica
export const addClientMetric = async (
  clientId: string, 
  month: string,
  webVisits: number,
  keywordsTop10: number,
  conversions: number,
  conversionGoal: number
): Promise<string> => {
  metricsLogger.info(`Agregando métrica para cliente: ${clientId}`);
  
  try {
    const { data, error } = await supabase
      .rpc('insert_client_metric', {
        p_client_id: clientId,
        p_month: month,
        p_web_visits: webVisits,
        p_keywords_top10: keywordsTop10,
        p_conversions: conversions,
        p_conversion_goal: conversionGoal
      });
    
    if (error) {
      metricsLogger.error("Error al agregar métrica:", error);
      throw error;
    }
    
    metricsLogger.info(`Métrica agregada exitosamente, ID: ${data}`);
    return data;
  } catch (error) {
    metricsLogger.error("Excepción al agregar métrica:", error);
    throw error;
  }
};

// Función para actualizar una métrica existente
export const updateClientMetric = async (
  id: string,
  clientId: string, 
  month: string,
  webVisits: number,
  keywordsTop10: number,
  conversions: number,
  conversionGoal: number
): Promise<boolean> => {
  metricsLogger.info(`Actualizando métrica ID: ${id} para cliente: ${clientId}`);
  
  try {
    const { data, error } = await supabase
      .rpc('update_client_metric', {
        p_id: id,
        p_client_id: clientId,
        p_month: month,
        p_web_visits: webVisits,
        p_keywords_top10: keywordsTop10,
        p_conversions: conversions,
        p_conversion_goal: conversionGoal
      });
    
    if (error) {
      metricsLogger.error("Error al actualizar métrica:", error);
      throw error;
    }
    
    metricsLogger.info(`Métrica actualizada exitosamente: ${data}`);
    return data;
  } catch (error) {
    metricsLogger.error("Excepción al actualizar métrica:", error);
    throw error;
  }
};
