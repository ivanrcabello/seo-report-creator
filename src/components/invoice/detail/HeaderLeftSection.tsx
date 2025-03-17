
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Invoice } from "@/types/invoice";

interface HeaderLeftSectionProps {
  invoice: Invoice;
  onGoBack: () => void;
}

export const HeaderLeftSection = ({ invoice, onGoBack }: HeaderLeftSectionProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onGoBack}
        className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileSpreadsheet className="h-6 w-6 text-primary" />
        Factura {invoice.invoiceNumber}
      </h1>
      <StatusBadge status={invoice.status} />
    </div>
  );
};
