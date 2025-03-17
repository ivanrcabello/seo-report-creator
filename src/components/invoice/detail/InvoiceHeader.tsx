
import { Invoice } from "@/types/invoice";
import { HeaderLeftSection } from "./HeaderLeftSection";
import { InvoiceActions } from "./InvoiceActions";

interface InvoiceHeaderProps {
  invoice: Invoice;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  onShareInvoice: () => Promise<void>;
  isDownloading?: boolean;
  isSendingEmail?: boolean;
  isSharing?: boolean;
  onGoBack: () => void;
}

export const InvoiceHeader = ({ 
  invoice, 
  onDelete, 
  onMarkAsPaid,
  onDownloadPdf,
  onSendEmail,
  onShareInvoice,
  isDownloading = false,
  isSendingEmail = false,
  isSharing = false,
  onGoBack
}: InvoiceHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <HeaderLeftSection 
        invoice={invoice} 
        onGoBack={onGoBack} 
      />
      
      <InvoiceActions 
        invoice={invoice}
        onDelete={onDelete}
        onMarkAsPaid={onMarkAsPaid}
        onDownloadPdf={onDownloadPdf}
        onSendEmail={onSendEmail}
        onShareInvoice={onShareInvoice}
        isDownloading={isDownloading}
        isSendingEmail={isSendingEmail}
        isSharing={isSharing}
      />
    </div>
  );
};
