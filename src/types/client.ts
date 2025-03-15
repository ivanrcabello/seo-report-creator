
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
  lastReport?: string;
  notes?: string[];
  documents?: any[];
  analyticsConnected?: boolean;
  searchConsoleConnected?: boolean;
  isActive?: boolean;
}

// The following are all the types referenced in error messages

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: "pdf" | "image" | "doc" | "text";
  url: string;
  uploadDate: string;
  analyzedStatus?: "pending" | "analyzed" | "error";
  content?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "draft" | "pending" | "paid" | "cancelled";
  notes?: string;
  pdfUrl?: string;
}

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
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  type: "seo" | "performance" | "technical" | "social";
  date: string;
  url?: string;
  content: any;
  status: "draft" | "published";
  publicToken?: string;
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
}

export interface SeoPack {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
}

export interface SeoLocalReport {
  id: string;
  clientId: string;
  reportDate: string;
  businessName: string;
  address: string;
  phoneNumber: string;
  website: string;
  googleBusinessUrl?: string;
  keywordRankings?: any[];
  localListings?: any[];
  reviewSummary?: {
    google?: { total: number; average: number };
    facebook?: { total: number; average: number };
    yelp?: { total: number; average: number };
  };
  competitorAnalysis?: any[];
  recommendations?: string[];
}

export interface SeoContract {
  id: string;
  clientId: string;
  contractNumber: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed" | "cancelled";
  monthlyAmount: number;
  signatureDate?: string;
  sections: ContractSection[];
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
