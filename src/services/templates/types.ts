
import { DocumentType, TemplateSection, DocumentTemplate } from "@/types/templates";
import { Json } from "@supabase/supabase-js";

// Types for database mapping
export type TemplateDbRow = {
  id: string;
  name: string;
  document_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  sections: Json;
  header_html?: string;
  footer_html?: string;
  cover_page_html?: string;
  css?: string;
};

// Types for insert/update operations
export type TemplateDbInsert = {
  name: string;
  document_type: string;
  is_default?: boolean;
  sections: Json;
  header_html?: string;
  footer_html?: string;
  cover_page_html?: string;
  css?: string;
  updated_at?: string;
};
