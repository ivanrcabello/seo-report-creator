
import { DocumentTemplate, DocumentType, TemplateSection } from "@/types/templates";
import { TemplateDbRow, TemplateDbInsert } from "./types";
import { Json } from "@supabase/supabase-js";

// Mapper to convert from DB format to application format
export const mapTemplateFromDB = (data: TemplateDbRow): DocumentTemplate => ({
  id: data.id,
  name: data.name,
  documentType: data.document_type as DocumentType,
  isDefault: data.is_default,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  sections: data.sections as TemplateSection[] || [],
  headerHtml: data.header_html,
  footerHtml: data.footer_html,
  coverPageHtml: data.cover_page_html,
  css: data.css
});

// Mapper to convert from application format to DB format
export const mapTemplateToDB = (template: Partial<DocumentTemplate>): TemplateDbInsert => ({
  name: template.name!,
  document_type: template.documentType!,
  is_default: template.isDefault,
  sections: template.sections as unknown as Json,
  header_html: template.headerHtml,
  footer_html: template.footerHtml,
  cover_page_html: template.coverPageHtml,
  css: template.css,
  updated_at: new Date().toISOString()
});
