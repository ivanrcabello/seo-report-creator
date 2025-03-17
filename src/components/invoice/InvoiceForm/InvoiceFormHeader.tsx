
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";

interface InvoiceFormHeaderProps {
  isNewInvoice: boolean;
  invoice: Invoice | null;
  client: Client | null;
  onGoBack: () => void;
}

export const InvoiceFormHeader = ({ 
  isNewInvoice, 
  invoice, 
  client, 
  onGoBack 
}: InvoiceFormHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          {isNewInvoice ? "Nueva Factura" : `Editando Factura ${invoice?.invoiceNumber}`}
        </CardTitle>
        <CardDescription>
          {isNewInvoice 
            ? "Crea una nueva factura para un cliente" 
            : `Factura para ${client?.name}`}
        </CardDescription>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onGoBack}
        className="gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  );
};
