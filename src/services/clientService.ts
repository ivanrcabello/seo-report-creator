
import { Client, ClientReport, ClientDocument, SeoLocalReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
  
  return data || [];
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
  
  return data || undefined;
};

export const addClient = async (client: Omit<Client, "id" | "createdAt">): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding client:", error);
    throw error;
  }
  
  return data;
};

export const updateClient = async (client: Client): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', client.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating client:", error);
    throw error;
  }
  
  return data;
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
  
  return data || [];
};

export const getAllReports = async (): Promise<ClientReport[]> => {
  const { data, error } = await supabase
    .from('client_reports')
    .select('*');
  
  if (error) {
    console.error("Error fetching all reports:", error);
    return [];
  }
  
  return data || [];
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
  
  return data || undefined;
};

export const addReport = async (report: Omit<ClientReport, "id">): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .insert([report])
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
  
  return data;
};

export const updateReport = async (report: ClientReport): Promise<ClientReport> => {
  const { data, error } = await supabase
    .from('client_reports')
    .update(report)
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating report:", error);
    throw error;
  }
  
  return data;
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
  
  return data || [];
};

export const getAllDocuments = async (): Promise<ClientDocument[]> => {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*');
  
  if (error) {
    console.error("Error fetching all documents:", error);
    return [];
  }
  
  return data || [];
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
  
  return data || undefined;
};

export const addDocument = async (document: Omit<ClientDocument, "id">): Promise<ClientDocument> => {
  const { data, error } = await supabase
    .from('client_documents')
    .insert([document])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding document:", error);
    throw error;
  }
  
  return data;
};

export const updateDocument = async (document: ClientDocument): Promise<ClientDocument> => {
  const { data, error } = await supabase
    .from('client_documents')
    .update(document)
    .eq('id', document.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating document:", error);
    throw error;
  }
  
  return data;
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
  
  return data;
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
  
  return data;
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
  
  return data || [];
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
  
  return data || undefined;
};

export const addLocalSeoReport = async (report: Omit<SeoLocalReport, "id">): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .insert([report])
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
  
  return data;
};

export const updateLocalSeoReport = async (report: SeoLocalReport): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .update(report)
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating local SEO report:", error);
    throw error;
  }
  
  return data;
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
  
  return data;
};
