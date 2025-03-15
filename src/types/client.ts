
import { Invoice as InvoiceType } from './invoice';

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

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: "pdf" | "image" | "doc" | "text";
  url: string;
  uploadDate: string;
  analyzedStatus?: "pending" | "analyzed" | "processed" | "failed" | "error";
  content?: string;
}

export type Invoice = InvoiceType;

export interface Proposal {
  id: string;
  clientId: string;
  packId: string;
  title: string;
  description: string;
  createdAt: string;
  sentAt?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  customPrice?: number;
  customFeatures?: string[];
  updatedAt?: string;
  expiresAt?: string;
  reportIds?: string[];
  publicUrl?: string;
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  type: "seo" | "performance" | "technical" | "social" | "local-seo";
  date: string;
  url?: string;
  content?: any;
  status?: "draft" | "published";
  documentIds?: string[];
  shareToken?: string;
  sharedAt?: string;
  notes?: string;
  includeInProposal?: boolean;
  analyticsData?: any;
  searchConsoleData?: any;
  auditResult?: any;
}

export interface CompanySettings {
  id?: string;
  companyName: string;
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  createdAt?: string;
  updatedAt?: string;
  bankAccount?: string;
}

export interface SeoPack {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt?: string;
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

export interface SeoContract {
  id: string;
  clientId: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  content?: {
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
  createdAt?: string;
  updatedAt?: string;
  signedAt?: string;
  signedByClient?: boolean;
  signedByProfessional?: boolean;
  pdfUrl?: string;
  phase1Fee?: number;
  monthlyFee?: number;
}

export interface ContractSection {
  title: string;
  content: string;
  order: number;
}

export interface ClientSummary {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
  isActive: boolean;
}
