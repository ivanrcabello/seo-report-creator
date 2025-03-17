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
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return [];
  }
  
  console.log("Fetched client documents:", data);
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

// Util function to determine file type
export const getFileType = (file: File): "pdf" | "image" | "doc" | "text" => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return "pdf";
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) return "image";
  if (['doc', 'docx'].includes(extension || '')) return "doc";
  return "text";
};

// Function to extract content from files for analysis
export const extractFileContent = async (file: File): Promise<string> => {
  const fileType = getFileType(file);
  
  if (fileType === "pdf") {
    // For PDFs, we'll use the existing pdfToText functionality
    const { pdfToText } = await import("@/services/pdfAnalyzer");
    try {
      return await pdfToText(file);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return "";
    }
  }
  
  if (fileType === "image") {
    // For images, we just return a placeholder text
    return `[Image: ${file.name}]`;
  }
  
  if (fileType === "doc") {
    // For Word documents, just a placeholder for now
    return `[Document: ${file.name}]`;
  }
  
  // For other text files
  try {
    return await file.text();
  } catch (error) {
    console.error("Error reading text file:", error);
    return "";
  }
};
