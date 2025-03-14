
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
  documents?: ClientDocument[];
  analyticsConnected?: boolean;
  searchConsoleConnected?: boolean;
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

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: "seo" | "performance" | "technical" | "social" | "local-seo";
  url?: string;
  notes?: string;
  documentIds: string[];
  shareToken: string | null;
  sharedAt: string | null;
  includeInProposal: boolean;
  analyticsData?: any;
  searchConsoleData?: any;
  auditResult?: any;
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

export interface SeoPack {
  id: string;
  name: string;
  description: string;
  price: number; // Precio en euros IVA incluido
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Proposal {
  id: string;
  clientId: string;
  title: string;
  description: string;
  packId: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  expiresAt?: string;
  customPrice?: number; // Precio personalizado si es diferente al del paquete
  customFeatures?: string[]; // Características personalizadas si son diferentes
  reportIds?: string[]; // IDs de los informes incluidos en la propuesta
  publicUrl?: string; // URL pública para que el cliente vea la propuesta
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
