
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, PenLine, Share2 } from "lucide-react";

interface ContractActionsProps {
  contractId: string;
  pdfUrl: string | null;
  signedByProfessional: boolean;
  onShare: () => Promise<void>;
  onGeneratePdf: () => Promise<void>;
  onSignOpen: () => void;
  isLoading: boolean;
  isPdfGenerating: boolean;
}

export const ContractActions = ({
  contractId,
  pdfUrl,
  signedByProfessional,
  onShare,
  onGeneratePdf,
  onSignOpen,
  isLoading,
  isPdfGenerating
}: ContractActionsProps) => {
  return (
    <div className="flex justify-between mb-6">
      <Button variant="outline" asChild>
        <Link to="/contracts" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a Contratos
        </Link>
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onShare} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
        <Button 
          variant={pdfUrl ? "outline" : "default"} 
          onClick={onGeneratePdf} 
          disabled={isPdfGenerating}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isPdfGenerating ? "Generando..." : (pdfUrl ? "Descargar PDF" : "Generar PDF")}
        </Button>
        {!signedByProfessional && (
          <Button 
            onClick={onSignOpen}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <PenLine className="h-4 w-4" />
            Firmar como Profesional
          </Button>
        )}
      </div>
    </div>
  );
};
