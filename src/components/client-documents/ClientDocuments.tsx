
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { DocumentList } from "./DocumentList";
import { NotesSection } from "./NotesSection";
import { GenerateReportButton } from "./GenerateReportButton";
import { FileText } from "lucide-react";
import { ClientDocument } from "@/types/client";

interface ClientDocumentsProps {
  clientId: string;
  onNoteAdded?: (notes: string[]) => void;
  onGenerateReport?: (documentIds: string[]) => void;
}

export const ClientDocuments: React.FC<ClientDocumentsProps> = ({
  clientId,
  onNoteAdded,
  onGenerateReport,
}) => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const toggleDocumentSelection = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
    } else {
      setSelectedDocuments((prev) => [...prev, docId]);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setNewNote("");
      if (onNoteAdded) {
        onNoteAdded(updatedNotes);
      }
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
    if (onGenerateReport) {
      onGenerateReport(selectedDocuments);
    }
  };

  // Load documents when the component mounts
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        // Here you would load the documents from your API
        const response = await fetch(`/api/clients/${clientId}/documents`);
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [clientId]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentos del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <NotesSection
            notes={notes}
            newNote={newNote}
            onNoteChange={setNewNote}
            onAddNote={handleAddNote}
            onRemoveNote={handleRemoveNote}
          />
        </CardContent>
      </Card>

      {selectedDocuments.length > 0 && (
        <GenerateReportButton
          selectedDocuments={selectedDocuments}
          documents={documents}
          setDocuments={setDocuments}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          setSelectedDocuments={setSelectedDocuments}
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
};
