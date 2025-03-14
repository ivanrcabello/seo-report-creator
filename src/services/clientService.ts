
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Función para convertir datos de Supabase al formato de la aplicación
const mapClientFromDB = (client: any): Client => ({
  id: client.id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.company,
  createdAt: client.created_at,
  lastReport: client.last_report,
  notes: client.notes,
  documents: [],
  analyticsConnected: client.analytics_connected,
  searchConsoleConnected: client.search_console_connected
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapClientToDB = (client: Partial<Client>) => ({
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.company,
  notes: client.notes,
  analytics_connected: client.analyticsConnected,
  search_console_connected: client.searchConsoleConnected
});

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  
  return (data || []).map(mapClientFromDB);
};

export const getClient = async (id: string): Promise<Client | undefined> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching client:", error);
    return undefined;
  }
  
  return data ? mapClientFromDB(data) : undefined;
};

export const addClient = async (client: Omit<Client, "id" | "createdAt">): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([mapClientToDB(client)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding client:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const updateClient = async (client: Client): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(mapClientToDB(client))
    .eq('id', client.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating client:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

// Client Notes operations
export const addClientNote = async (clientId: string, note: string): Promise<Client | undefined> => {
  // Primero obtenemos el cliente actual para obtener notas existentes
  const { data: client } = await supabase
    .from('clients')
    .select('notes')
    .eq('id', clientId)
    .maybeSingle();
  
  if (!client) return undefined;
  
  // Preparamos el array de notas
  const notes = client.notes || [];
  notes.push(note);
  
  // Actualizamos el cliente
  const { data, error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) {
    console.error("Error adding client note:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const removeClientNote = async (clientId: string, index: number): Promise<Client | undefined> => {
  // Primero obtenemos el cliente actual para obtener notas existentes
  const { data: client } = await supabase
    .from('clients')
    .select('notes')
    .eq('id', clientId)
    .maybeSingle();
  
  if (!client || !client.notes || index < 0 || index >= client.notes.length) {
    return undefined;
  }
  
  // Eliminamos la nota específica
  const notes = [...client.notes];
  notes.splice(index, 1);
  
  // Actualizamos el cliente
  const { data, error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) {
    console.error("Error removing client note:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};
