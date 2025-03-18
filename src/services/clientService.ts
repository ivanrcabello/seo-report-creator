
import { supabase } from "@/integrations/supabase/client";
import { ClientSummary } from "@/types/client";
import { toast } from "sonner";

export const getClients = async () => {
  try {
    console.log("Fetching clients from Supabase...");
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }

    console.log("Successfully fetched clients:", data);
    return data || [];
  } catch (error) {
    console.error("Exception in getClients:", error);
    toast.error("Error al cargar los clientes");
    throw error;
  }
};

export const getClient = async (id: string) => {
  try {
    console.log(`Fetching client with ID: ${id}`);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      throw error;
    }

    console.log("Successfully fetched client:", data);
    return data;
  } catch (error) {
    console.error(`Exception in getClient for ID ${id}:`, error);
    toast.error("Error al cargar los datos del cliente");
    throw error;
  }
};

export const createClient = async (clientData: Omit<ClientSummary, 'id' | 'createdAt'>) => {
  try {
    console.log("Creating new client with data:", clientData);
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          is_active: clientData.isActive
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw error;
    }

    console.log("Successfully created client:", data);
    toast.success("Cliente creado con éxito");
    return data;
  } catch (error) {
    console.error("Exception in createClient:", error);
    toast.error("Error al crear el cliente");
    throw error;
  }
};

export const updateClient = async (id: string, clientData: Partial<ClientSummary>) => {
  try {
    console.log(`Updating client with ID ${id} with data:`, clientData);
    const updateData: Record<string, any> = {};
    
    if (clientData.name) updateData.name = clientData.name;
    if (clientData.email) updateData.email = clientData.email;
    if (clientData.company) updateData.company = clientData.company;
    if (clientData.isActive !== undefined) updateData.is_active = clientData.isActive;
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }

    console.log("Successfully updated client:", data);
    toast.success("Cliente actualizado con éxito");
    return data;
  } catch (error) {
    console.error(`Exception in updateClient for ID ${id}:`, error);
    toast.error("Error al actualizar el cliente");
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    console.log(`Deleting client with ID: ${id}`);
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw error;
    }

    console.log(`Successfully deleted client with ID: ${id}`);
    toast.success("Cliente eliminado con éxito");
    return true;
  } catch (error) {
    console.error(`Exception in deleteClient for ID ${id}:`, error);
    toast.error("Error al eliminar el cliente");
    throw error;
  }
};
