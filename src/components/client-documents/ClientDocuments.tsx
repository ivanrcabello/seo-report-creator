
import { useState, useEffect } from 'react';
import { getClientDocuments, addDocument, deleteDocument } from '@/services/documentService';
import { ClientDocument } from '@/types/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentList } from './DocumentList';
import { DocumentUploadSection } from './DocumentUploadSection';
import { NotesSection } from './NotesSection';
import { GenerateReportButton } from './GenerateReportButton';

interface ClientDocumentsProps {
  clientId: string;
  onNoteAdded?: (notes: string[]) => void;
  onGenerateReport?: (documentIds: string[]) => void;
}

export const ClientDocuments = ({ clientId, onNoteAdded, onGenerateReport }: ClientDocumentsProps) => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (!clientId) {
        console.error("No clientId provided to ClientDocuments");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching documents for client:", clientId);
        const docs = await getClientDocuments(clientId);
        console.log("Fetched documents:", docs);
        setDocuments(docs);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos del cliente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [clientId, toast]);

  const handleFileUpload = async (file: File) => {
    if (!clientId) {
      console.error("Cannot upload file: No clientId available");
      toast({
        title: "Error",
        description: "No se pudo identificar el cliente",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
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
      
      // 3. Extract content for analysis
      let content = '';
      let fileType = "text";
      
      if (file.type === "application/pdf") {
        fileType = "pdf";
        try {
          const { extractFileContent } = await import('@/services/documentService');
          content = await extractFileContent(file);
        } catch (err) {
          console.error("Error extracting content:", err);
        }
      } else if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        fileType = "doc";
      }
      
      // 4. Add document to database
      const newDocument: Omit<ClientDocument, "id"> = {
        clientId,
        name: file.name,
        type: fileType as "pdf" | "image" | "doc" | "text",
        url: fileUrl,
        uploadDate: new Date().toISOString(),
        analyzedStatus: content ? 'analyzed' : 'pending',
        content
      };
      
      const addedDoc = await addDocument(newDocument);
      console.log("Document added to database:", addedDoc);
      
      // 5. Update local state
      setDocuments(prevDocs => [...prevDocs, addedDoc]);
      
      toast({
        title: "Documento subido",
        description: "El documento ha sido subido correctamente",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al subir el documento",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
      
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento",
        variant: "destructive",
      });
    }
  };

  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNote('');
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
  };

  const handleRemoveNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
  };

  const handleGenerateReport = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Seleccione documentos",
        description: "Por favor, seleccione al menos un documento para generar el informe",
        variant: "destructive",
      });
      return;
    }
    
    if (onGenerateReport) {
      onGenerateReport(selectedDocuments);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Cargando documentos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DocumentUploadSection 
        clientId={clientId}
        isUploading={uploading}
        documents={documents}
        setDocuments={setDocuments}
        setIsUploading={setUploading}
      />
      
      <DocumentList 
        documents={documents}
        selectedDocuments={selectedDocuments}
        isLoading={loading}
        toggleDocumentSelection={toggleDocumentSelection}
        setSelectedDocuments={setSelectedDocuments}
        setDocuments={setDocuments}
      />
      
      <NotesSection 
        notes={notes}
        newNote={newNote}
        onNoteChange={setNewNote}
        onAddNote={handleAddNote}
        onRemoveNote={handleRemoveNote}
      />
      
      <GenerateReportButton 
        selectedDocuments={selectedDocuments}
        documents={documents}
        setDocuments={setDocuments}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        setSelectedDocuments={setSelectedDocuments}
        onGenerateReport={onGenerateReport}
      />
    </div>
  );
};
