
import { ClientDocument } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";

// Función para convertir datos de Supabase al formato de la aplicación
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

// Función para convertir datos de la aplicación al formato de Supabase
const mapDocumentToDB = (doc: Partial<ClientDocument>) => ({
  client_id: doc.clientId,
  name: doc.name,
  type: doc.type,
  url: doc.url,
  upload_date: doc.uploadDate,
  analyzed_status: doc.analyzedStatus,
  content: doc.content
});

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
