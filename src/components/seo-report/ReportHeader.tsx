
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ReportHeaderProps {
  handlePrint: () => void;
  handleDownload: () => void;
}

export const ReportHeader = ({ handlePrint, handleDownload }: ReportHeaderProps) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      await handleDownload();
      toast({
        title: "Descarga iniciada",
        description: "El informe se está descargando.",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Button variant="outline" asChild>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </Button>
      <div className="flex gap-2 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
        <Button 
          onClick={handleDownloadClick} 
          className="flex items-center gap-2"
          disabled={isDownloading}
        >
          <FileDown className="h-4 w-4" /> 
          {isDownloading ? "Descargando..." : "Descargar PDF"}
        </Button>
      </div>
    </div>
  );
};
