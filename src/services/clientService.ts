
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  searchConsoleConnected: client.search_console_connected,
  isActive: client.is_active
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapClientToDB = (client: Partial<Client>) => ({
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.company,
  notes: client.notes,
  analytics_connected: client.analyticsConnected,
  search_console_connected: client.searchConsoleConnected,
  is_active: client.isActive
});

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching clients:", error);
      toast.error("Error al cargar los clientes");
      return [];
    }
    
    return (data || []).map(mapClientFromDB);
  } catch (error) {
    console.error("Exception fetching clients:", error);
    toast.error("Error al cargar los clientes");
    return [];
  }
};

export const getClient = async (id: string): Promise<Client | undefined> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching client:", error);
      toast.error("Error al cargar el cliente");
      return undefined;
    }
    
    return data ? mapClientFromDB(data) : undefined;
  } catch (error) {
    console.error("Exception fetching client:", error);
    toast.error("Error al cargar el cliente");
    return undefined;
  }
};

export const addClient = async (client: Omit<Client, "id" | "createdAt">): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([mapClientToDB(client)])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding client:", error);
      toast.error("Error al crear el cliente");
      throw error;
    }
    
    return mapClientFromDB(data);
  } catch (error) {
    console.error("Exception adding client:", error);
    toast.error("Error al crear el cliente");
    throw error;
  }
};

export const updateClient = async (client: Client): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(mapClientToDB(client))
      .eq('id', client.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client:", error);
      toast.error("Error al actualizar el cliente");
      throw error;
    }
    
    return mapClientFromDB(data);
  } catch (error) {
    console.error("Exception updating client:", error);
    toast.error("Error al actualizar el cliente");
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar el cliente");
      throw error;
    }
    
    toast.success("Cliente eliminado correctamente");
  } catch (error) {
    console.error("Exception deleting client:", error);
    toast.error("Error al eliminar el cliente");
    throw error;
  }
};

// Client Notes operations
export const addClientNote = async (clientId: string, note: string): Promise<Client | undefined> => {
  try {
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
      toast.error("Error al añadir la nota");
      throw error;
    }
    
    toast.success("Nota añadida correctamente");
    return mapClientFromDB(data);
  } catch (error) {
    console.error("Exception adding client note:", error);
    toast.error("Error al añadir la nota");
    throw error;
  }
};

export const removeClientNote = async (clientId: string, index: number): Promise<Client | undefined> => {
  try {
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
      toast.error("Error al eliminar la nota");
      throw error;
    }
    
    toast.success("Nota eliminada correctamente");
    return mapClientFromDB(data);
  } catch (error) {
    console.error("Exception removing client note:", error);
    toast.error("Error al eliminar la nota");
    throw error;
  }
};

// Update client active status
export const updateClientActiveStatus = async (clientId: string, isActive: boolean): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ is_active: isActive })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client active status:", error);
      toast.error(`Error al ${isActive ? 'activar' : 'desactivar'} el cliente`);
      throw error;
    }
    
    toast.success(`Cliente ${isActive ? 'activado' : 'desactivado'} correctamente`);
    return mapClientFromDB(data);
  } catch (error) {
    console.error("Exception updating client active status:", error);
    toast.error(`Error al ${isActive ? 'activar' : 'desactivar'} el cliente`);
    throw error;
  }
};
