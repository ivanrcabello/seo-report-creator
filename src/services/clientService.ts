
import { Client, ClientReport, ClientDocument, SeoLocalReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Funciones de mapeo para convertir entre formatos
const mapClientFromDB = (client: any): Client => ({
  id: client.id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.company,
  createdAt: client.created_at,
  lastReport: client.last_report,
  notes: client.notes,
  documents: [],
  analyticsConnected: client.analytics_connected,
  searchConsoleConnected: client.search_console_connected
});

const mapClientToDB = (client: Partial<Client>) => ({
  name: client.name,
  email: client.email,
  phone: client.phone,
  company: client.company,
  notes: client.notes,
  analytics_connected: client.analyticsConnected,
  search_console_connected: client.searchConsoleConnected
});

const mapReportFromDB = (report: any): ClientReport => ({
  id: report.id,
  clientId: report.client_id,
  title: report.title,
  date: report.date,
  type: report.type,
  url: report.url,
  notes: report.notes,
  documentIds: report.document_ids,
  shareToken: report.share_token,
  sharedAt: report.shared_at,
  includeInProposal: report.include_in_proposal
});

const mapReportToDB = (report: Partial<ClientReport>) => ({
  client_id: report.clientId,
  title: report.title,
  date: report.date,
  type: report.type,
  url: report.url,
  notes: report.notes,
  document_ids: report.documentIds,
  share_token: report.shareToken,
  shared_at: report.sharedAt,
  include_in_proposal: report.includeInProposal
});

const mapDocumentFromDB = (doc: any): ClientDocument => ({
  id: doc.id,
  clientId: doc.client_id,
  name: doc.name,
  type: doc.type,
  url: doc.url,
  uploadDate: doc.upload_date,
  analyzedStatus: doc.analyzed_status,
  content: doc.content
});

const mapDocumentToDB = (doc: Partial<ClientDocument>) => ({
  client_id: doc.clientId,
  name: doc.name,
  type: doc.type,
  url: doc.url,
  upload_date: doc.uploadDate,
  analyzed_status: doc.analyzedStatus,
  content: doc.content
});

const mapLocalSeoReportFromDB = (report: any): SeoLocalReport => ({
  id: report.id,
  clientId: report.client_id,
  title: report.title,
  date: report.date,
  businessName: report.business_name,
  location: report.location,
  googleMapsRanking: report.google_maps_ranking,
  localListings: report.local_listings,
  keywordRankings: report.keyword_rankings,
  recommendations: report.recommendations,
  shareToken: report.share_token,
  sharedAt: report.shared_at
});

const mapLocalSeoReportToDB = (report: Partial<SeoLocalReport>) => ({
  client_id: report.clientId,
  title: report.title,
  date: report.date,
  business_name: report.businessName,
  location: report.location,
  google_maps_ranking: report.googleMapsRanking,
  local_listings: report.localListings as Json,
  keyword_rankings: report.keywordRankings as Json,
  recommendations: report.recommendations,
  share_token: report.shareToken,
  shared_at: report.sharedAt
});

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  
  return (data || []).map(mapClientFromDB);
};

export const getClient = async (id: string): Promise<Client | undefined> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching client:", error);
    return undefined;
  }
  
  return data ? mapClientFromDB(data) : undefined;
};

export const addClient = async (client: Omit<Client, "id" | "createdAt">): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([mapClientToDB(client)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding client:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const updateClient = async (client: Client): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(mapClientToDB(client))
    .eq('id', client.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating client:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

// Report CRUD operations
export const getClientReports = async (clientId: string): Promise<ClientReport[]> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching client reports:", error);
    return [];
  }
  
  return (data || []).map(mapReportFromDB);
};

export const getAllReports = async (): Promise<ClientReport[]> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*');
  
  if (error) {
    console.error("Error fetching all reports:", error);
    return [];
  }
  
  return (data || []).map(mapReportFromDB);
};

export const getReport = async (id: string): Promise<ClientReport | undefined> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching report:", error);
    return undefined;
  }
  
  return data ? mapReportFromDB(data) : undefined;
};

export const addReport = async (report: Omit<ClientReport, "id">): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .insert([mapReportToDB(report)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding report:", error);
    throw error;
  }
  
  // Update client's lastReport date
  await supabase
    .from('clients')
    .update({ last_report: report.date })
    .eq('id', report.clientId);
  
  return mapReportFromDB(data);
};

export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .update(mapReportToDB(report))
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating report:", error);
    throw error;
  }
  
  return mapReportFromDB(data);
};

export const deleteReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('client_reports')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

// Document operations
export const getClientDocuments = async (clientId: string): Promise<ClientDocument[]> => {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching client documents:", error);
    return [];
  }
  
  return (data || []).map(mapDocumentFromDB);
};

export const getAllDocuments = async (): Promise<ClientDocument[]> => {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*');
  
  if (error) {
    console.error("Error fetching all documents:", error);
    return [];
  }
  
  return (data || []).map(mapDocumentFromDB);
};

export const getDocument = async (id: string): Promise<ClientDocument | undefined> => {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching document:", error);
    return undefined;
  }
  
  return data ? mapDocumentFromDB(data) : undefined;
};

export const addDocument = async (document: Omit<ClientDocument, "id">): Promise<ClientDocument> => {
  const { data, error } = await supabase
    .from('client_documents')
    .insert([mapDocumentToDB(document)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding document:", error);
    throw error;
  }
  
  return mapDocumentFromDB(data);
};

export const updateDocument = async (document: ClientDocument): Promise<ClientDocument> => {
  const { data, error } = await supabase
    .from('client_documents')
    .update(mapDocumentToDB(document))
    .eq('id', document.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating document:", error);
    throw error;
  }
  
  return mapDocumentFromDB(data);
};

export const deleteDocument = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Client Notes operations
export const addClientNote = async (clientId: string, note: string): Promise<Client | undefined> => {
  // Primero obtenemos el cliente actual para obtener notas existentes
  const { data: client } = await supabase
    .from('clients')
    .select('notes')
    .eq('id', clientId)
    .maybeSingle();
  
  if (!client) return undefined;
  
  // Preparamos el array de notas
  const notes = client.notes || [];
  notes.push(note);
  
  // Actualizamos el cliente
  const { data, error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) {
    console.error("Error adding client note:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

export const removeClientNote = async (clientId: string, index: number): Promise<Client | undefined> => {
  // Primero obtenemos el cliente actual para obtener notas existentes
  const { data: client } = await supabase
    .from('clients')
    .select('notes')
    .eq('id', clientId)
    .maybeSingle();
  
  if (!client || !client.notes || index < 0 || index >= client.notes.length) {
    return undefined;
  }
  
  // Eliminamos la nota específica
  const notes = [...client.notes];
  notes.splice(index, 1);
  
  // Actualizamos el cliente
  const { data, error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) {
    console.error("Error removing client note:", error);
    throw error;
  }
  
  return mapClientFromDB(data);
};

// Local SEO report operations
export const getLocalSeoReports = async (clientId: string): Promise<SeoLocalReport[]> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching local SEO reports:", error);
    return [];
  }
  
  return (data || []).map(mapLocalSeoReportFromDB);
};

export const getLocalSeoReport = async (id: string): Promise<SeoLocalReport | undefined> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching local SEO report:", error);
    return undefined;
  }
  
  return data ? mapLocalSeoReportFromDB(data) : undefined;
};

export const addLocalSeoReport = async (report: Omit<SeoLocalReport, "id">): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .insert([mapLocalSeoReportToDB(report)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding local SEO report:", error);
    throw error;
  }
  
  // Update client's lastReport date
  await supabase
    .from('clients')
    .update({ last_report: report.date })
    .eq('id', report.clientId);
  
  return mapLocalSeoReportFromDB(data);
};

export const updateLocalSeoReport = async (report: SeoLocalReport): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .update(mapLocalSeoReportToDB(report))
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating local SEO report:", error);
    throw error;
  }
  
  return mapLocalSeoReportFromDB(data);
};

export const deleteLocalSeoReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('seo_local_reports')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting local SEO report:", error);
    throw error;
  }
};

// Share report function
export const shareReport = async (report: ClientReport): Promise<ClientReport> => {
  const shareToken = report.shareToken || uuidv4();
  const sharedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('client_reports')
    .update({ 
      share_token: shareToken,
      shared_at: sharedAt
    })
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
  
  return mapReportFromDB(data);
};
