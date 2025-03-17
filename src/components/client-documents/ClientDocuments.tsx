
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { DocumentList } from "./DocumentList";
import { NotesSection } from "./NotesSection";
import { GenerateReportButton } from "./GenerateReportButton";
import { FileText } from "lucide-react";

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
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleDocumentUploaded = (newDoc: any) => {
    console.log("Document uploaded:", newDoc);
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleDocumentDeleted = (docId: string) => {
    console.log("Document deleted:", docId);
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
  };

  const handleDocumentSelected = (docId: string, selected: boolean) => {
    if (selected) {
      setSelectedDocuments((prev) => [...prev, docId]);
    } else {
      setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
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
        setLoading(true);
        // Here you would load the documents from your API
        const response = await fetch(`/api/clients/${clientId}/documents`);
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoading(false);
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
            onDocumentUploaded={handleDocumentUploaded} 
          />

          <DocumentList
            documents={documents}
            loading={loading}
            selectedDocuments={selectedDocuments}
            onDocumentSelected={handleDocumentSelected}
            onDocumentDeleted={handleDocumentDeleted}
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
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
};
