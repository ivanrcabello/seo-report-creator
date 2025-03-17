
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { CompanySettings } from "@/types/invoice";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceContent } from "./InvoiceContent";

interface InvoiceDetailContainerProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  packName: string | null;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  onShareInvoice: () => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  isPdfGenerating: boolean;
  isSendingEmail?: boolean;
  isSharing?: boolean;
  onGoBack: () => void;
}

export const InvoiceDetailContainer = ({
  invoice,
  client,
  company,
  packName,
  onDelete,
  onMarkAsPaid,
  onDownloadPdf,
  onSendEmail,
  onShareInvoice,
  formatCurrency,
  formatDate,
  isPdfGenerating,
  isSendingEmail = false,
  isSharing = false,
  onGoBack,
}: InvoiceDetailContainerProps) => {
  return (
    <div className="container max-w-5xl py-8">
      <InvoiceHeader
        invoice={invoice}
        onDelete={onDelete}
        onMarkAsPaid={onMarkAsPaid}
        onDownloadPdf={onDownloadPdf}
        onSendEmail={onSendEmail}
        onShareInvoice={onShareInvoice}
        isDownloading={isPdfGenerating}
        isSendingEmail={isSendingEmail}
        isSharing={isSharing}
        onGoBack={onGoBack}
      />
      <InvoiceContent
        invoice={invoice}
        client={client}
        company={company}
        packName={packName}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
};
