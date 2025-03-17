
import { ClientDocuments } from "../client-documents/ClientDocumentsView";

interface PdfUploadTabProps {
  clientId: string;
}

export const PdfUploadTab = ({ clientId }: PdfUploadTabProps) => {
  console.log("PdfUploadTab rendering with clientId:", clientId);
  
  return (
    <ClientDocuments 
      clientId={clientId}
      onNoteAdded={(notes) => {
        console.log("Notes updated:", notes);
        // We could update the client state here if needed
      }}
      onGenerateReport={(documentIds) => {
        console.log("Generate report with documents:", documentIds);
        // Here we could implement report generation functionality
      }}
    />
  );
};
