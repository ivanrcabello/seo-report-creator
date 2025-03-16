
import { DocumentTemplate, DocumentType } from "@/types/templates";
import { createTemplate } from "./templateMutations";
import { getTemplates } from "./templateQueries";

// Create default template for SEO reports if none exists
export const createDefaultSeoReportTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Check if any template for SEO reports exists already
    const templates = await getTemplates('seo-report');
    if (templates.length > 0) return templates[0];
    
    // Create the default template
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
