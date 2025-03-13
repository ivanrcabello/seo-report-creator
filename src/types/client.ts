
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
}

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'text';
  url: string;
  uploadDate: string;
  analyzedStatus?: 'pending' | 'processed' | 'failed';
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
}
