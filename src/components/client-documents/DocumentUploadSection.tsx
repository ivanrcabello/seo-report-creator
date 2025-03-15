
import React from "react";
import { FileUploader } from "@/components/FileUploader";
import { ClientDocument } from "@/types/client";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      const fileURL = URL.createObjectURL(file);

      const newDocument: Omit<ClientDocument, "id"> = {
        clientId: clientId,
        name: file.name,
        type: type,
        url: fileURL,
        uploadDate: new Date().toISOString(),
        analyzedStatus: "pending",
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
