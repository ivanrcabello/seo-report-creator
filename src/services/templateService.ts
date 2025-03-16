
import { DocumentType, DocumentTemplate } from "@/types/templates";

// Re-export everything from the separate modules
export { getTemplates, getTemplateById, getDefaultTemplate } from './templates/templateQueries';
export { createTemplate, updateTemplate, deleteTemplate, setAsDefaultTemplate } from './templates/templateMutations';
export { 
  createDefaultSeoReportTemplate, 
  createDefaultProposalTemplate, 
  createDefaultInvoiceTemplate, 
  createDefaultContractTemplate,
  createAllDefaultTemplates 
} from './templates/defaultTemplates';

// Export mappers if needed elsewhere
export { mapTemplateFromDB, mapTemplateToDB } from './templates/mappers';
