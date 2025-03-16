
export type DocumentType = 'seo-report' | 'proposal' | 'invoice' | 'contract';

export interface TemplateSection {
  id: string;
  name: string;
  content: string;
  isEnabled: boolean;
  order: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  sections: TemplateSection[];
  headerHtml?: string;
  footerHtml?: string;
  coverPageHtml?: string;
  css?: string;
}
