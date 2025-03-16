
export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  created_at?: string;
  last_report?: string;
  is_active?: boolean;
  notes?: string[];
  analytics_connected?: boolean;
  search_console_connected?: boolean;
}

export interface ClientDocument {
  id: string;
  name: string;
  client_id: string;
  url: string;
  type: string;
  upload_date: string;
  content?: string;
  analyzed_status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ClientKeyword {
  id: string;
  client_id: string;
  keyword: string;
  position?: number | null;
  target_position?: number;
  previous_position?: number | null;
  date_added?: string;
  last_updated?: string;
  search_volume?: number;
  keyword_difficulty?: number;
  cpc?: number;
  traffic?: number;
  traffic_percentage?: number;
  traffic_cost?: number;
  competition?: number;
  trends?: string;
  serp_features?: string;
  keyword_intent?: string;
  position_type?: string;
  url?: string;
  backlinks_count?: number;
  timestamp?: string;
}

export interface ClientMetric {
  id: string;
  client_id?: string;
  month: string;
  web_visits: number;
  keywords_top10: number;
  conversions: number;
  conversion_goal: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: string;
  content?: string;
  url?: string;
  notes?: string;
  documentIds?: string[];
  shareToken?: string;
  sharedAt?: string;
  includeInProposal?: boolean;
  analyticsData?: any;
  status?: 'draft' | 'published' | 'shared';
  auditResult?: any; // Para compatibilidad con versiones anteriores
}

export interface ClientLocalSEOSettings {
  id: string;
  client_id: string;
  business_name: string;
  address: string;
  phone?: string;
  website?: string;
  google_business_url?: string;
  target_locations?: string[];
  google_reviews_count?: number;
  google_reviews_average?: number;
  listings_count?: number;
  google_maps_ranking?: number;
  rank_tracking_enabled?: boolean;
  last_metrics_update?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LocalSEOMetric {
  id: string;
  client_id: string;
  google_maps_ranking?: number;
  google_reviews_count?: number;
  google_reviews_average?: number;
  listings_count?: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface SeoPack {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_active: boolean;
  created_at?: string;
}

export interface Proposal {
  id: string;
  clientId: string;
  title: string;
  description: string;
  packId: string;
  customPrice?: number;
  customFeatures?: string[];
  reportIds?: string[];
  status: string;
  publicUrl?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  expiresAt?: string;
}
