
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

// ... other types if needed
