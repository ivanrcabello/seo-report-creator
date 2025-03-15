import React from "react";
import { Button } from "@/components/ui/button";
import { Map, Clock } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { ClientDocument } from "@/types/client";

interface GenerateReportButtonProps {
  selectedDocuments: string[];
  documents: ClientDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ClientDocument[]>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  onGenerateReport?: (documentIds: string[]) => void;
}

export const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({
  selectedDocuments,
  documents,
  setDocuments,
  isGenerating,
  setIsGenerating,
  setSelectedDocuments,
  onGenerateReport,
}) => {
  const handleAnalyzeDocuments = async () => {
    if (onGenerateReport && selectedDocuments.length > 0) {
      setIsGenerating(true);
      
      try {
        sonnerToast("Generando informe...", {
          description: "Analizando los documentos seleccionados...",
          duration: 2000,
        });
        
        // Marcamos documentos como analizados
        const updatedDocs = documents.map(doc => {
          if (selectedDocuments.includes(doc.id)) {
            return { 
              ...doc, 
              analyzedStatus: "analyzed" 
            };
          }
          return doc;
        });
        
        setDocuments(updatedDocs);
        
        await new Promise(r => setTimeout(r, 1000)); // Pequeña espera para la animación
        
        // Llamar a la función para generar informe
        onGenerateReport(selectedDocuments);
        
        // Limpiar selección
        setSelectedDocuments([]);
      } catch (error) {
        console.error("Error generating report:", error);
        sonnerToast.error("Error al generar el informe");
      } finally {
        setIsGenerating(false);
      }
    } else {
      sonnerToast.error("Selecciona al menos un documento para generar un informe");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <Button 
        onClick={handleAnalyzeDocuments} 
        className="gap-2"
        disabled={selectedDocuments.length === 0 || isGenerating}
      >
        {isGenerating ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Map className="h-4 w-4" />
            Generar Informe
          </>
        )}
      </Button>
    </div>
  );
};
