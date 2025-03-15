
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
