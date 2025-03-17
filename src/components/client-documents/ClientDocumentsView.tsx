
import React from "react";
import { ClientDocuments } from "./ClientDocuments";

interface ClientDocumentsViewProps {
  clientId: string;
}

export const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ clientId }) => {
  return (
    <ClientDocuments
      clientId={clientId}
      onNoteAdded={(notes) => {
        console.log("Notes updated:", notes);
      }}
      onGenerateReport={(documentIds) => {
        console.log("Generate report with documents:", documentIds);
      }}
    />
  );
};
