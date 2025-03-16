
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
  search_volume?: number;
  keyword_difficulty?: number;
  cpc?: number;
  url?: string;
  traffic?: number;
  traffic_percentage?: number;
  traffic_cost?: number;
  competition?: number;
  backlinks_count?: number;
  trends?: string;
  timestamp?: string;
  serp_features?: string;
  keyword_intent?: string;
  position_type?: string;
}

// Get all keywords for a client
export const getClientKeywords = async (clientId: string): Promise<ClientKeyword[]> => {
  try {
    console.log("Fetching keywords with client ID:", clientId);
    const { data, error } = await supabase
      .rpc('get_client_keywords', { client_id_param: clientId });
    
    if (error) {
      console.error("Error fetching client keywords:", error);
      toast.error("Error al cargar las palabras clave");
      return [];
    }
    
    console.log("Keywords fetched successfully:", data);
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
  position?: number | null,
  targetPosition?: number,
  additionalData?: Partial<ClientKeyword>
): Promise<ClientKeyword | null> => {
  try {
    console.log(`Adding keyword "${keyword}" to client ${clientId}`);
    console.log("Position:", position, "Type:", typeof position);
    console.log("Target position:", targetPosition);
    
    const keywordData = {
      client_id: clientId,
      keyword: keyword,
      position: position,
      target_position: targetPosition || 10,
      ...additionalData
    };
    
    const { data, error } = await supabase
      .from('client_keywords')
      .insert([keywordData])
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
    
    console.log("Keyword added successfully:", data);
    toast.success(`Palabra clave "${keyword}" añadida correctamente`);
    return data;
  } catch (error) {
    console.error("Exception adding client keyword:", error);
    toast.error("Error al añadir la palabra clave");
    return null;
  }
};

// Add multiple keywords at once
export const addClientKeywords = async (
  clientId: string,
  keywords: Partial<ClientKeyword>[]
): Promise<boolean> => {
  try {
    console.log(`Adding ${keywords.length} keywords to client ${clientId}`);
    
    const keywordsData = keywords.map(kw => ({
      client_id: clientId,
      keyword: kw.keyword || '',
      position: kw.position || null,
      target_position: kw.target_position || 10,
      search_volume: kw.search_volume,
      keyword_difficulty: kw.keyword_difficulty,
      cpc: kw.cpc,
      url: kw.url,
      traffic: kw.traffic,
      traffic_percentage: kw.traffic_percentage,
      traffic_cost: kw.traffic_cost,
      competition: kw.competition,
      backlinks_count: kw.backlinks_count,
      trends: kw.trends,
      timestamp: kw.timestamp,
      serp_features: kw.serp_features,
      keyword_intent: kw.keyword_intent,
      position_type: kw.position_type
    }));
    
    // Use upsert to update existing keywords and insert new ones
    const { error } = await supabase
      .from('client_keywords')
      .upsert(keywordsData, {
        onConflict: 'client_id,keyword',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error("Error adding client keywords:", error);
      toast.error("Error al importar las palabras clave");
      return false;
    }
    
    console.log("Keywords added successfully");
    toast.success(`${keywords.length} palabras clave importadas correctamente`);
    return true;
  } catch (error) {
    console.error("Exception adding client keywords:", error);
    toast.error("Error al importar las palabras clave");
    return false;
  }
};

// Update a keyword
export const updateClientKeyword = async (
  keywordId: string,
  updates: Partial<ClientKeyword>
): Promise<ClientKeyword | null> => {
  try {
    console.log(`Updating keyword ${keywordId}:`, updates);
    
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
    
    console.log("Keyword updated successfully:", data);
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
    console.log(`Deleting keyword ${keywordId}`);
    const { error } = await supabase
      .from('client_keywords')
      .delete()
      .eq('id', keywordId);
    
    if (error) {
      console.error("Error deleting client keyword:", error);
      toast.error("Error al eliminar la palabra clave");
      return false;
    }
    
    console.log("Keyword deleted successfully");
    toast.success("Palabra clave eliminada correctamente");
    return true;
  } catch (error) {
    console.error("Exception deleting client keyword:", error);
    toast.error("Error al eliminar la palabra clave");
    return false;
  }
};
