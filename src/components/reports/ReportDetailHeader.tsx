
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, FileDown, Share2, ClipboardCopy, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { ClientReport } from "@/types/client";

interface ReportDetailHeaderProps {
  report: ClientReport;
  client: any;
  isAdmin: boolean;
  sharedUrl: string | null;
  isCopied: boolean;
  isSharing: boolean;
  isProcessing: boolean;
  handleGoBack: () => void;
  handleShareReport: () => void;
  copyToClipboard: () => void;
  handleDownloadPdf: () => void;
}

export const ReportDetailHeader = ({
  report,
  client,
  isAdmin,
  sharedUrl,
  isCopied,
  isSharing,
  isProcessing,
  handleGoBack,
  handleShareReport,
  copyToClipboard,
  handleDownloadPdf
}: ReportDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleGoBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          Detalles del Informe
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPdf}
          disabled={isProcessing}
          className="gap-1"
        >
          {isProcessing ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Generando PDF...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Descargar PDF
            </>
          )}
        </Button>
        {sharedUrl ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={isCopied} className="gap-1">
              {isCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
              {isCopied ? "Copiado!" : "Copiar Enlace"}
            </Button>
            <a href={sharedUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ClipboardCopy className="h-4 w-4" />
                Ver Informe Compartido
              </Button>
            </a>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShareReport} 
            disabled={isSharing}
            className="gap-1"
          >
            {isSharing ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Generando enlace...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Compartir Informe
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
