
import { Invoice } from "@/types/invoice";
import { InvoiceHeader } from "./detail";

interface InvoiceDetailHeaderProps {
  invoice: Invoice;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  onShareInvoice: () => Promise<void>;
  isDownloading?: boolean;
  isSendingEmail?: boolean;
  isSharing?: boolean;
  statusBadge: React.ReactNode;
  onGoBack: () => void;
}

export const InvoiceDetailHeader = (props: InvoiceDetailHeaderProps) => {
  // We're not using statusBadge prop anymore as we've built it into our components
  const { statusBadge, ...headerProps } = props;
  
  return <InvoiceHeader {...headerProps} />;
};
