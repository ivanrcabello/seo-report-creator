
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
