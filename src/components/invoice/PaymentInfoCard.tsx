
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Invoice } from "@/types/invoice";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

interface PaymentInfoCardProps {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export const PaymentInfoCard = ({
  invoice,
  formatCurrency,
  formatDate
}: PaymentInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Información de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between pb-2 border-b">
          <span className="text-gray-600 text-sm">Estado:</span>
          <div><InvoiceStatusBadge status={invoice.status} /></div>
        </div>
        
        <div className="flex justify-between pb-2 border-b">
          <span className="text-gray-600 text-sm">Nº Factura:</span>
          <span className="font-medium">{invoice.invoiceNumber}</span>
        </div>
        
        <div className="flex justify-between pb-2 border-b">
          <span className="text-gray-600 text-sm">Fecha Emisión:</span>
          <span className="font-medium">{formatDate(invoice.issueDate)}</span>
        </div>
        
        {invoice.dueDate && (
          <div className="flex justify-between pb-2 border-b">
            <span className="text-gray-600 text-sm">Fecha Vencimiento:</span>
            <span className="font-medium">{formatDate(invoice.dueDate)}</span>
          </div>
        )}
        
        {invoice.status === "paid" && invoice.paymentDate && (
          <div className="flex justify-between pb-2 border-b">
            <span className="text-gray-600 text-sm">Fecha Pago:</span>
            <span className="font-medium">{formatDate(invoice.paymentDate)}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-2 mt-2">
          <span className="text-gray-800 font-semibold">Total a Pagar:</span>
          <span className="text-blue-700 font-bold text-lg">
            {formatCurrency(invoice.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
