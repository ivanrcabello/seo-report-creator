
import { supabase } from "@/integrations/supabase/client";
import { DocumentTemplate, DocumentType, TemplateSection } from "@/types/templates";
import { toast } from "sonner";

// Mappers para convertir entre formatos de BD y aplicación
const mapTemplateFromDB = (data: any): DocumentTemplate => ({
  id: data.id,
  name: data.name,
  documentType: data.document_type,
  isDefault: data.is_default,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  sections: data.sections || [],
  headerHtml: data.header_html,
  footerHtml: data.footer_html,
  coverPageHtml: data.cover_page_html,
  css: data.css
});

const mapTemplateToDB = (template: Partial<DocumentTemplate>) => ({
  name: template.name,
  document_type: template.documentType,
  is_default: template.isDefault,
  sections: template.sections,
  header_html: template.headerHtml,
  footer_html: template.footerHtml,
  cover_page_html: template.coverPageHtml,
  css: template.css,
  updated_at: new Date().toISOString()
});

// Obtener todas las plantillas de un tipo de documento
export const getTemplates = async (documentType: DocumentType): Promise<DocumentTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('document_type', documentType)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(mapTemplateFromDB);
  } catch (error) {
    console.error("Error fetching templates:", error);
    toast.error("Error al cargar las plantillas");
    return [];
  }
};

// Obtener una plantilla por ID
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

// Obtener la plantilla por defecto para un tipo de documento
export const getDefaultTemplate = async (documentType: DocumentType): Promise<DocumentTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('document_type', documentType)
      .eq('is_default', true)
      .single();
      
    if (error) {
      // Si no hay plantilla por defecto, intentamos obtener cualquier plantilla
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

// Crear una nueva plantilla
export const createTemplate = async (template: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .insert(mapTemplateToDB(template))
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

// Actualizar una plantilla existente
export const updateTemplate = async (templateId: string, template: Partial<DocumentTemplate>): Promise<DocumentTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .update(mapTemplateToDB(template))
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

// Eliminar una plantilla
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

// Establecer una plantilla como predeterminada
export const setAsDefaultTemplate = async (templateId: string, documentType: DocumentType): Promise<boolean> => {
  try {
    // Primero quitamos el estado predeterminado de todas las plantillas de ese tipo
    await supabase
      .from('document_templates')
      .update({ is_default: false })
      .eq('document_type', documentType);
    
    // Luego establecemos la nueva plantilla predeterminada
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

// Crear plantilla predeterminada para informes SEO si no existe ninguna
export const createDefaultSeoReportTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Comprobar si ya existe alguna plantilla para informes SEO
    const templates = await getTemplates('seo-report');
    if (templates.length > 0) return templates[0];
    
    // Crear la plantilla predeterminada
    const defaultTemplate: Partial<DocumentTemplate> = {
      name: "Plantilla Predeterminada de Informes SEO",
      documentType: 'seo-report',
      isDefault: true,
      sections: [
        {
          id: "introduction",
          name: "Introducción",
          content: "<h2>Introducción</h2><p>Este informe analiza el estado actual del SEO de su sitio web y proporciona recomendaciones para mejorar su visibilidad en los motores de búsqueda.</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: "website-analysis",
          name: "Análisis del Sitio Web",
          content: "<h2>Análisis del Sitio Web</h2><p>A continuación se presentan los resultados del análisis técnico de su sitio web.</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: "keywords",
          name: "Palabras Clave",
          content: "<h2>Análisis de Palabras Clave</h2><p>Estas son las palabras clave más relevantes para su negocio y su posicionamiento actual.</p>",
          isEnabled: true,
          order: 3
        },
        {
          id: "technical-seo",
          name: "SEO Técnico",
          content: "<h2>SEO Técnico</h2><p>Análisis de los aspectos técnicos que afectan al SEO de su sitio web.</p>",
          isEnabled: true,
          order: 4
        },
        {
          id: "recommendations",
          name: "Recomendaciones",
          content: "<h2>Recomendaciones</h2><p>Basándonos en nuestro análisis, recomendamos las siguientes acciones para mejorar el SEO de su sitio web.</p>",
          isEnabled: true,
          order: 5
        },
        {
          id: "conclusion",
          name: "Conclusión",
          content: "<h2>Conclusión</h2><p>Implementando estas recomendaciones, esperamos ver una mejora significativa en el posicionamiento de su sitio web en los próximos meses.</p>",
          isEnabled: true,
          order: 6
        }
      ],
      headerHtml: "<div style='text-align: right; font-size: 10pt; color: #666;'>{{companyName}}</div>",
      footerHtml: "<div style='text-align: center; font-size: 8pt; color: #666;'>Página {{currentPage}} de {{totalPages}} | {{companyName}}</div>",
      coverPageHtml: "<div style='text-align: center; padding-top: 100px;'><img src='{{companyLogo}}' style='max-width: 200px; margin-bottom: 50px;'><h1 style='font-size: 24pt; color: #333;'>{{reportTitle}}</h1><p style='font-size: 14pt; color: #666;'>Preparado para: {{clientName}}</p><p style='font-size: 12pt; color: #888;'>{{reportDate}}</p></div>",
      css: "h1 { color: #2563eb; font-size: 18pt; margin-bottom: 10px; } h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 10px; } p { font-size: 10pt; line-height: 1.5; } table { width: 100%; border-collapse: collapse; } th { background-color: #f1f5f9; font-weight: bold; text-align: left; padding: 8px; } td { padding: 8px; border-bottom: 1px solid #e2e8f0; }"
    };
    
    return await createTemplate(defaultTemplate);
  } catch (error) {
    console.error("Error creating default template:", error);
    return null;
  }
};
