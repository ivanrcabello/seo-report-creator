
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DocumentTemplate } from "@/types/templates";
import { mapTemplateFromDB, mapTemplateToDB } from "./mappers";
import { toast } from "sonner";

// Create a new template
export const createTemplate = async (template: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> => {
  try {
    const mappedTemplate = mapTemplateToDB(template);
    
    const { data, error } = await supabase
      .from('document_templates')
      .insert(mappedTemplate)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapTemplateFromDB(data);
  } catch (error) {
    console.error("Error creating template:", error);
    toast.error("Error al crear la plantilla");
    return null;
  }
};

// Update an existing template
export const updateTemplate = async (templateId: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> => {
  try {
    const mappedTemplate = mapTemplateToDB(template);
    
    const { data, error } = await supabase
      .from('document_templates')
      .update(mappedTemplate)
      .eq('id', templateId)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapTemplateFromDB(data);
  } catch (error) {
    console.error("Error updating template:", error);
    toast.error("Error al actualizar la plantilla");
    return null;
  }
};

// Delete a template
export const deleteTemplate = async (templateId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', templateId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting template:", error);
    toast.error("Error al eliminar la plantilla");
    return false;
  }
};

// Set a template as default
export const setAsDefaultTemplate = async (templateId: string, documentType: DocumentType): Promise<boolean> => {
  try {
    // First remove default status from all templates of this type
    await supabase
      .from('document_templates')
      .update({ is_default: false })
      .eq('document_type', documentType);
    
    // Then set the new default template
    const { error } = await supabase
      .from('document_templates')
      .update({ is_default: true })
      .eq('id', templateId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error setting default template:", error);
    toast.error("Error al establecer la plantilla predeterminada");
    return false;
  }
};
