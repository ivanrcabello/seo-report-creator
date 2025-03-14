
import { SeoPack } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

// Operaciones CRUD para paquetes - Modificadas para usar Supabase
export const getSeoPacks = async (): Promise<SeoPack[]> => {
  const { data, error } = await supabase
    .from('seo_packs')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error("Error fetching SEO packs:", error);
    return [];
  }
  
  return data || [];
};

export const getAllSeoPacks = async (): Promise<SeoPack[]> => {
  const { data, error } = await supabase
    .from('seo_packs')
    .select('*');
  
  if (error) {
    console.error("Error fetching all SEO packs:", error);
    return [];
  }
  
  return data || [];
};

export const getSeoPack = async (id: string): Promise<SeoPack | undefined> => {
  const { data, error } = await supabase
    .from('seo_packs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching SEO pack:", error);
    return undefined;
  }
  
  return data || undefined;
};

export const addSeoPack = async (pack: Omit<SeoPack, "id" | "createdAt">): Promise<SeoPack> => {
  const { data, error } = await supabase
    .from('seo_packs')
    .insert([pack])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding SEO pack:", error);
    throw error;
  }
  
  return data;
};

export const updateSeoPack = async (pack: SeoPack): Promise<SeoPack> => {
  const { data, error } = await supabase
    .from('seo_packs')
    .update(pack)
    .eq('id', pack.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating SEO pack:", error);
    throw error;
  }
  
  return data;
};

export const deleteSeoPack = async (id: string): Promise<void> => {
  // En lugar de eliminar, actualizamos is_active a false
  const { error } = await supabase
    .from('seo_packs')
    .update({ is_active: false })
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting SEO pack:", error);
    throw error;
  }
};
