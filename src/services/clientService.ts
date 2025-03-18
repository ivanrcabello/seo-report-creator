import { supabase } from "@/integrations/supabase/client";
import logger from "@/services/logService";

// Logger específico para clientService
const clientLogger = logger.getLogger('clientService');

export const getClients = async () => {
  clientLogger.info("Solicitando lista de clientes");
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      clientLogger.error("Error al obtener clientes:", error);
      throw error;
    }
    
    clientLogger.info(`Obtenidos ${data?.length || 0} clientes`);
    return data;
  } catch (error) {
    clientLogger.error("Excepción al obtener clientes:", error);
    throw error;
  }
};
