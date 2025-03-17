
import { FileSpreadsheet } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/invoice/detail/StatusBadge";
import { Invoice } from "@/types/invoice";

interface InvoiceShareHeaderProps {
  invoice: Invoice;
}

export const InvoiceShareHeader = ({ invoice }: InvoiceShareHeaderProps) => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Factura {invoice.invoiceNumber}</CardTitle>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </CardHeader>
    </Card>
  );
};
