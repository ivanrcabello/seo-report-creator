
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DocumentTemplate } from "@/types/templates";
import { mapTemplateFromDB, mapTemplateToDB } from "./mappers";
import { toast } from "sonner";

// Get all templates of a specific document type
export const getTemplates = async (documentType: DocumentType): Promise<DocumentTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('document_type', documentType)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return Array.isArray(data) ? data.map(mapTemplateFromDB) : [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    toast.error("Error al cargar las plantillas");
    return [];
  }
};

// Get a template by ID
export const getTemplateById = async (templateId: string): Promise<DocumentTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', templateId)
      .single();
      
    if (error) throw error;
    
    return mapTemplateFromDB(data);
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
};

// Get the default template for a document type
export const getDefaultTemplate = async (documentType: DocumentType): Promise<DocumentTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('document_type', documentType)
      .eq('is_default', true)
      .single();
      
    if (error) {
      // If no default template, try to get any template
      const { data: anyTemplate, error: anyError } = await supabase
        .from('document_templates')
        .select('*')
        .eq('document_type', documentType)
        .limit(1)
        .single();
        
      if (anyError) return null;
      
      return mapTemplateFromDB(anyTemplate);
    }
    
    return mapTemplateFromDB(data);
  } catch (error) {
    console.error("Error fetching default template:", error);
    return null;
  }
};
