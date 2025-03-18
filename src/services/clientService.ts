
import { supabase } from "@/integrations/supabase/client";
import logger from "@/services/logService";
import { Client } from "@/types/client";

// Logger específico para clientService
const clientLogger = logger.getLogger('clientService');

// Función para mapear cliente desde formato DB a formato de la aplicación
const mapClientFromDB = (dbClient: any): Client => {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    company: dbClient.company,
    phone: dbClient.phone,
    createdAt: dbClient.created_at,
    lastReport: dbClient.last_report,
    isActive: dbClient.is_active,
    notes: dbClient.notes,
    analyticsConnected: dbClient.analytics_connected,
    searchConsoleConnected: dbClient.search_console_connected,
    website: dbClient.website,
    sector: dbClient.sector,
    hostingDetails: dbClient.hosting_details,
    wordpressAccess: dbClient.wordpress_access,
    projectPasswords: dbClient.project_passwords
  };
};

// Función para mapear cliente desde formato aplicación a formato DB
const mapClientToDB = (client: Partial<Client>): any => {
  const result: any = {};
  
  if (client.id !== undefined) result.id = client.id;
  if (client.name !== undefined) result.name = client.name;
  if (client.email !== undefined) result.email = client.email;
  if (client.company !== undefined) result.company = client.company;
  if (client.phone !== undefined) result.phone = client.phone;
  if (client.createdAt !== undefined) result.created_at = client.createdAt;
  if (client.lastReport !== undefined) result.last_report = client.lastReport;
  if (client.isActive !== undefined) result.is_active = client.isActive;
  if (client.notes !== undefined) result.notes = client.notes;
  if (client.analyticsConnected !== undefined) result.analytics_connected = client.analyticsConnected;
  if (client.searchConsoleConnected !== undefined) result.search_console_connected = client.searchConsoleConnected;
  if (client.website !== undefined) result.website = client.website;
  if (client.sector !== undefined) result.sector = client.sector;
  if (client.hostingDetails !== undefined) result.hosting_details = client.hostingDetails;
  if (client.wordpressAccess !== undefined) result.wordpress_access = client.wordpressAccess;
  if (client.projectPasswords !== undefined) result.project_passwords = client.projectPasswords;
  
  return result;
};

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
    // Mapear los datos de la DB al formato de la aplicación
    return data?.map(client => mapClientFromDB(client)) || [];
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
    // Mapear el cliente de la DB al formato de la aplicación
    return mapClientFromDB(data);
  } catch (error) {
    clientLogger.error(`Excepción al obtener cliente ${clientId}:`, error);
    throw error;
  }
};

// Función para añadir un nuevo cliente
export const addClient = async (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
  clientLogger.info("Añadiendo nuevo cliente");
  
  try {
    // Convertir datos del cliente al formato de la DB
    const dbClientData = mapClientToDB(clientData);
    
    const { data, error } = await supabase
      .from('clients')
      .insert([dbClientData])
      .select()
      .single();
    
    if (error) {
      clientLogger.error("Error al añadir cliente:", error);
      throw error;
    }
    
    clientLogger.info(`Cliente añadido correctamente, ID: ${data.id}`);
    // Devolver el cliente en formato de aplicación
    return mapClientFromDB(data);
  } catch (error) {
    clientLogger.error("Excepción al añadir cliente:", error);
    throw error;
  }
};

// Función para actualizar un cliente existente
export const updateClient = async (clientData: Client) => {
  clientLogger.info(`Actualizando cliente con ID: ${clientData.id}`);
  
  try {
    // Convertir datos del cliente al formato de la DB
    const dbClientData = mapClientToDB(clientData);
    
    const { data, error } = await supabase
      .from('clients')
      .update(dbClientData)
      .eq('id', clientData.id)
      .select()
      .single();
    
    if (error) {
      clientLogger.error(`Error al actualizar cliente ${clientData.id}:`, error);
      throw error;
    }
    
    clientLogger.info(`Cliente ${clientData.id} actualizado correctamente`);
    // Devolver el cliente en formato de aplicación
    return mapClientFromDB(data);
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
    // Devolver el cliente en formato de aplicación
    return mapClientFromDB(data);
  } catch (error) {
    clientLogger.error(`Excepción al actualizar estado de cliente ${clientId}:`, error);
    throw error;
  }
};
