
import React from "react";
import { FileUploader } from "@/components/FileUploader";
import { ClientDocument } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploadSectionProps {
  clientId: string;
  isUploading: boolean;
  documents: ClientDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ClientDocument[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  clientId,
  isUploading,
  documents,
  setDocuments,
  setIsUploading,
}) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File, content: string, type: "pdf" | "image" | "doc" | "text") => {
    setIsUploading(true);
    try {
      console.log("Uploading file:", file.name, "for client:", clientId);
      
      // 1. Upload file to Supabase storage
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `client-documents/${clientId}/${fileName}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (storageError) {
        console.error("Storage upload error:", storageError);
        throw new Error("Error al subir el archivo a almacenamiento");
      }
      
      // 2. Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData?.publicUrl;
      if (!fileUrl) {
        throw new Error("No se pudo obtener URL pública del archivo");
      }
      
      console.log("File uploaded successfully:", fileUrl);

      const newDocument: Omit<ClientDocument, "id"> = {
        clientId: clientId,
        name: file.name,
        type: type,
        url: fileUrl,
        uploadDate: new Date().toISOString(),
        analyzedStatus: content ? "analyzed" : "pending",
        content: content,
      };

      const { addDocument } = await import("@/services/documentService");
      const uploadedDocument = await addDocument(newDocument);
      setDocuments([...documents, uploadedDocument]);
      toast({
        title: "Documento subido",
        description: `${file.name} ha sido subido correctamente.`,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally { 
      setIsUploading(false);
    }
  };

  return (
    <FileUploader 
      onFileUpload={handleFileUpload}
      isLoading={isUploading}
      allowedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"]}
      maxSizeMB={25}
    />
  );
};
