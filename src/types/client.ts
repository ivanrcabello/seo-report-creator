export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: string;
  url?: string;
  notes?: string;
  content?: string; // Add content field for storing formatted report
  documentIds: string[];
  shareToken?: string;
  sharedAt?: string | null;
  includeInProposal?: boolean;
}
