
import { supabase } from "@/integrations/supabase/client";
import logger from "@/services/logService";
import { Client } from "@/types/client";

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

// Función para obtener un cliente específico por ID
export const getClient = async (clientId: string) => {
  clientLogger.info(`Solicitando cliente con ID: ${clientId}`);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      clientLogger.error(`Error al obtener cliente ${clientId}:`, error);
      throw error;
    }
    
    clientLogger.info(`Cliente ${clientId} obtenido correctamente`);
    return data;
  } catch (error) {
    clientLogger.error(`Excepción al obtener cliente ${clientId}:`, error);
    throw error;
  }
};

// Función para añadir un nuevo cliente
export const addClient = async (clientData: Omit<Client, "id" | "created_at" | "last_report">) => {
  clientLogger.info("Añadiendo nuevo cliente");
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) {
      clientLogger.error("Error al añadir cliente:", error);
      throw error;
    }
    
    clientLogger.info(`Cliente añadido correctamente, ID: ${data.id}`);
    return data;
  } catch (error) {
    clientLogger.error("Excepción al añadir cliente:", error);
    throw error;
  }
};

// Función para actualizar un cliente existente
export const updateClient = async (clientData: Client) => {
  clientLogger.info(`Actualizando cliente con ID: ${clientData.id}`);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', clientData.id)
      .select()
      .single();
    
    if (error) {
      clientLogger.error(`Error al actualizar cliente ${clientData.id}:`, error);
      throw error;
    }
    
    clientLogger.info(`Cliente ${clientData.id} actualizado correctamente`);
    return data;
  } catch (error) {
    clientLogger.error(`Excepción al actualizar cliente ${clientData.id}:`, error);
    throw error;
  }
};

// Función para eliminar un cliente
export const deleteClient = async (clientId: string) => {
  clientLogger.info(`Eliminando cliente con ID: ${clientId}`);
  
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) {
      clientLogger.error(`Error al eliminar cliente ${clientId}:`, error);
      return { success: false, error: error.message };
    }
    
    clientLogger.info(`Cliente ${clientId} eliminado correctamente`);
    return { success: true };
  } catch (error) {
    clientLogger.error(`Excepción al eliminar cliente ${clientId}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido" 
    };
  }
};

// Función para actualizar el estado activo de un cliente
export const updateClientActiveStatus = async (clientId: string, isActive: boolean) => {
  clientLogger.info(`Actualizando estado de cliente ${clientId} a: ${isActive ? 'activo' : 'inactivo'}`);
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ is_active: isActive })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) {
      clientLogger.error(`Error al actualizar estado de cliente ${clientId}:`, error);
      throw error;
    }
    
    clientLogger.info(`Estado de cliente ${clientId} actualizado correctamente`);
    return data;
  } catch (error) {
    clientLogger.error(`Excepción al actualizar estado de cliente ${clientId}:`, error);
    throw error;
  }
};
