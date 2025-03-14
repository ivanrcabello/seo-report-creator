// Client types definitions

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
  lastReport?: string;
  notes?: string[];
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  type: "seo" | "performance" | "technical" | "social" | "local-seo";
  date: string;
  url?: string;
  notes?: string;
  documentIds: string[];
  shareToken: string | null;
  sharedAt: string | null;
  includeInProposal: boolean;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: "pdf" | "doc" | "image" | "text";
  url: string;
  uploadDate: string;
  analyzedStatus: "pending" | "analyzed" | "processed" | "error" | "failed";
  content?: string;
}

export interface SeoLocalReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  googleMapsRating: number;
  googleReviewsCount: number;
  directoryListings: {
    name: string;
    listed: boolean;
    url?: string;
  }[];
  recommendations: string[];
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string; // CIF/NIF
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  paymentDate?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ... other types if needed
