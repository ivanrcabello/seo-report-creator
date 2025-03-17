
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { InvoiceDetailsCard } from "@/components/invoice/InvoiceDetailsCard";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";

interface InvoiceContentProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  packName: string | null;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export const InvoiceContent = ({
  invoice,
  client,
  company,
  packName,
  formatCurrency,
  formatDate
}: InvoiceContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="md:col-span-2">
        <InvoiceDetailsCard 
          invoice={invoice}
          client={client}
          company={company}
          packName={packName}
          formatCurrency={formatCurrency}
        />
      </div>
      <div>
        <PaymentInfoCard 
          invoice={invoice}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};
