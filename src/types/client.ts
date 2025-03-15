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
  type: 'pdf' | 'image' | 'doc' | 'text';
  url: string;
  uploadDate: string;
  analyzedStatus?: 'pending' | 'analyzed' | 'processed' | 'failed' | 'error';
  content?: string;
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: 'seo' | 'performance' | 'technical' | 'social' | 'local-seo';
  url?: string;
  notes?: string;
  documentIds?: string[];
  shareToken?: string; // Token único para compartir el informe
  sharedAt?: string; // Fecha en que se compartió el informe
  includeInProposal?: boolean; // Indicador para incluir en propuestas
  analyticsData?: AnalyticsData; // Datos de Google Analytics
  searchConsoleData?: SearchConsoleData; // Datos de Search Console
  auditResult?: any; // Resultados del análisis de auditoría
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

export interface AnalyticsData {
  sessionCount: number;
  userCount: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: {
    path: string;
    views: number;
    avgTimeOnPage: number;
  }[];
  trafficBySource: {
    source: string;
    sessions: number;
    percentage: number;
  }[];
  conversionRate?: number;
  timeRange: {
    from: string;
    to: string;
  };
}

export interface SearchConsoleData {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  topQueries: {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  topPages: {
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  timeRange: {
    from: string;
    to: string;
  };
}

export interface SeoLocalReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  businessName: string;
  location: string;
  googleMapsRanking?: number;
  localListings?: {
    platform: string;
    url?: string;
    status: 'claimed' | 'unclaimed' | 'inconsistent';
  }[];
  keywordRankings?: {
    keyword: string;
    position: number;
    localPosition?: number;
  }[];
  recommendations?: string[];
  shareToken?: string; // Token único para compartir el informe
  sharedAt?: string; // Fecha en que se compartió el informe
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
  taxId: string;
  address: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  bankAccount?: string; // Added bankAccount property
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
