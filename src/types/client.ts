

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
  isActive?: boolean;
}

export interface ClientSummary {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
  isActive?: boolean;
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

export interface SeoContract {
  id: string;
  clientId: string;
  title: string;
  startDate: string;
  endDate?: string;
  phase1Fee: number;
  monthlyFee: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  content: {
    sections: ContractSection[];
    clientInfo: {
      name: string;
      company?: string;
      address?: string;
      taxId?: string;
    };
    professionalInfo: {
      name: string;
      company: string;
      address: string;
      taxId: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  signedByClient: boolean;
  signedByProfessional: boolean;
  pdfUrl?: string;
}

export interface ContractSection {
  title: string;
  content: string;
  order: number;
}

export interface SeoLocalReport {
  id: string;
  clientId: string;
  title?: string;
  date?: string;
  businessName: string;
  address?: string;
  location?: string;
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
  googleMapsRanking?: number;
  googleReviewsCount?: number;
  keywordRankings?: any[];
  localListings?: any[];
  shareToken?: string;
  sharedAt?: string;
  recommendations?: string[];
}

export interface SeoPack {
  id: string;
  name: string;
  description: string;
  price: number; 
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
  customPrice?: number;
  customFeatures?: string[];
  reportIds?: string[];
  publicUrl?: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  bankAccount?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  number: string;  // Make it non-optional to match the Invoice from invoice.ts
  clientId: string;
  clientName?: string;
  issueDate: string;
  date?: string;
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  subtotal?: number;
  taxRate: number;
  tax?: number;
  taxAmount: number;
  totalAmount: number;
  total?: number;
  status: "pending" | "paid" | "cancelled" | "draft";
  paymentDate?: string;
  paidAt?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

