
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReportHeaderProps {
  handlePrint: () => void;
  handleDownload: () => void;
}

export const ReportHeader = ({ handlePrint, handleDownload }: ReportHeaderProps) => {
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
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" /> Descargar PDF
        </Button>
      </div>
    </div>
  );
};
