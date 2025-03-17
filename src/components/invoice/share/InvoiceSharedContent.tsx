
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CompanyClientInfo } from "./CompanyClientInfo";
import { InvoiceDetailsTable } from "./InvoiceDetailsTable";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";
import { InvoiceShareHeader } from "./InvoiceShareHeader";

interface InvoiceSharedContentProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export const InvoiceSharedContent = ({ 
  invoice, 
  client, 
  company, 
  formatCurrency, 
  formatDate 
}: InvoiceSharedContentProps) => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <InvoiceShareHeader invoice={invoice} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Detalles de la Factura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <CompanyClientInfo company={company} client={client} />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Conceptos</h3>
                <InvoiceDetailsTable invoice={invoice} formatCurrency={formatCurrency} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <PaymentInfoCard 
            invoice={invoice}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};
