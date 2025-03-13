
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
  lastReport?: string;
}

export interface ClientReport {
  id: string;
  clientId: string;
  title: string;
  date: string;
  type: 'seo' | 'performance' | 'technical' | 'social';
  url?: string;
  notes?: string;
}
