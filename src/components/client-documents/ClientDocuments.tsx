
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientDocument } from "@/types/client";
import { getClientDocuments } from "@/services/documentService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, FilePlus } from "lucide-react";

// Import our refactored components
import { DocumentUploadSection } from "./DocumentUploadSection";
import { DocumentList } from "./DocumentList";
import { NotesSection } from "./NotesSection";
import { GenerateReportButton } from "./GenerateReportButton";

interface ClientDocumentsProps {
  clientId: string;
  notes?: string[];
  onNoteAdded?: (updatedNotes: string[]) => void;
  onGenerateReport?: (documentIds: string[]) => void;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ 
  clientId, 
  notes = [],
  onNoteAdded,
  onGenerateReport 
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"documents" | "notes">("documents");
  const [clientNotes, setClientNotes] = useState<string[]>(notes);

  useEffect(() => {
    setClientNotes(notes);
  }, [notes]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const fetchedDocuments = await getClientDocuments(clientId);
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId, toast]);

  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Cliente</CardTitle>
        <CardDescription>
          Gestiona los documentos y notas asociados a este cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="documents" value={activeTab} onValueChange={(value) => setActiveTab(value as "documents" | "notes")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="documents" className="flex items-center gap-1.5">
              <FilePlus className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1.5">
              <StickyNote className="h-4 w-4" />
              Notas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-6">
            <DocumentUploadSection 
              clientId={clientId}
              isUploading={isUploading}
              documents={documents}
              setDocuments={setDocuments}
              setIsUploading={setIsUploading}
            />

            <DocumentList 
              documents={documents}
              selectedDocuments={selectedDocuments}
              isLoading={isLoading}
              toggleDocumentSelection={toggleDocumentSelection}
              setSelectedDocuments={setSelectedDocuments}
              setDocuments={setDocuments}
            />

            {documents.length > 0 && onGenerateReport && (
              <GenerateReportButton 
                selectedDocuments={selectedDocuments}
                documents={documents}
                setDocuments={setDocuments}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                setSelectedDocuments={setSelectedDocuments}
                onGenerateReport={onGenerateReport}
              />
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <NotesSection 
              clientNotes={clientNotes}
              setClientNotes={setClientNotes}
              onNoteAdded={onNoteAdded}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;
