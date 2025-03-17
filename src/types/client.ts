export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: string;
  url?: string;
  notes?: string;
  content: string;
  documentIds: string[];
  shareToken?: string;
  sharedAt?: string | null;
  includeInProposal?: boolean;
  analyticsData: any;
  searchConsoleData?: any;
  auditResult?: any;
  status?: 'draft' | 'published' | 'shared';
}

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
  website?: string;
  sector?: string;
  hostingDetails?: Record<string, any>;
  wordpressAccess?: Record<string, any>;
  projectPasswords?: Record<string, any>;
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

export interface Proposal {
  id: string;
  clientId: string;
  packId: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  customPrice?: number;
  customFeatures?: string[];
  publicUrl?: string;
  sentAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  aiContent?: string;
  additionalNotes?: string;
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
  status: "pending" | "paid" | "cancelled" | "draft";
  paymentDate?: string;
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export type SeoPack = Pack;

export interface SeoLocalReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  businessName: string;
  location?: string;
  address: string;
  phone: string | null;
  website: string | null;
  googleBusinessUrl?: string | null;
  googleMapsRanking?: number;
  googleReviewsCount?: number;
  googleReviewsAverage?: number;
  keywordRankings?: any;
  localListings?: any;
  shareToken?: string;
  sharedAt?: string | null;
  recommendations?: string[];
  directoryListings?: {
    name: string;
    listed: boolean;
    url?: string;
  }[];
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

export interface CompanySettings {
  id: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSummary {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string | Date;
  isActive: boolean;
}
