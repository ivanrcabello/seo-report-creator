
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientKeyword {
  id: string;
  client_id: string;
  keyword: string;
  position: number | null;
  previous_position: number | null;
  target_position: number;
  date_added: string;
  last_updated: string;
}

// Get all keywords for a client
export const getClientKeywords = async (clientId: string): Promise<ClientKeyword[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_client_keywords', { client_id_param: clientId });
    
    if (error) {
      console.error("Error fetching client keywords:", error);
      toast.error("Error al cargar las palabras clave");
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching client keywords:", error);
    toast.error("Error al cargar las palabras clave");
    return [];
  }
};

// Add a new keyword
export const addClientKeyword = async (
  clientId: string, 
  keyword: string, 
  position?: number,
  targetPosition?: number
): Promise<ClientKeyword | null> => {
  try {
    const { data, error } = await supabase
      .from('client_keywords')
      .insert([{
        client_id: clientId,
        keyword: keyword,
        position: position || null,
        target_position: targetPosition || 10
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding client keyword:", error);
      if (error.code === '23505') {
        toast.error(`La palabra clave "${keyword}" ya existe para este cliente`);
      } else {
        toast.error("Error al añadir la palabra clave");
      }
      return null;
    }
    
    toast.success(`Palabra clave "${keyword}" añadida correctamente`);
    return data;
  } catch (error) {
    console.error("Exception adding client keyword:", error);
    toast.error("Error al añadir la palabra clave");
    return null;
  }
};

// Update a keyword
export const updateClientKeyword = async (
  keywordId: string,
  updates: Partial<ClientKeyword>
): Promise<ClientKeyword | null> => {
  try {
    // Store the previous position before updating
    if (updates.position !== undefined) {
      const { data: currentData } = await supabase
        .from('client_keywords')
        .select('position')
        .eq('id', keywordId)
        .single();
      
      if (currentData && currentData.position !== updates.position) {
        updates.previous_position = currentData.position;
      }
    }

    const { data, error } = await supabase
      .from('client_keywords')
      .update(updates)
      .eq('id', keywordId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client keyword:", error);
      toast.error("Error al actualizar la palabra clave");
      return null;
    }
    
    toast.success("Palabra clave actualizada correctamente");
    return data;
  } catch (error) {
    console.error("Exception updating client keyword:", error);
    toast.error("Error al actualizar la palabra clave");
    return null;
  }
};

// Delete a keyword
export const deleteClientKeyword = async (keywordId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_keywords')
      .delete()
      .eq('id', keywordId);
    
    if (error) {
      console.error("Error deleting client keyword:", error);
      toast.error("Error al eliminar la palabra clave");
      return false;
    }
    
    toast.success("Palabra clave eliminada correctamente");
    return true;
  } catch (error) {
    console.error("Exception deleting client keyword:", error);
    toast.error("Error al eliminar la palabra clave");
    return false;
  }
};
