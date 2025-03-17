
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Download, 
  Edit, 
  Check, 
  Mail,
  Share2,
  Printer
} from "lucide-react";
import { DeleteInvoiceDialog } from "./DeleteInvoiceDialog";
import { Invoice } from "@/types/invoice";

interface InvoiceActionsProps {
  invoice: Invoice;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  onShareInvoice: () => Promise<void>;
  isDownloading?: boolean;
  isSendingEmail?: boolean;
  isSharing?: boolean;
}

export const InvoiceActions = ({ 
  invoice, 
  onDelete, 
  onMarkAsPaid,
  onDownloadPdf,
  onSendEmail,
  onShareInvoice,
  isDownloading = false,
  isSendingEmail = false,
  isSharing = false
}: InvoiceActionsProps) => {
  return (
    <div className="flex items-center space-x-2 flex-wrap gap-2">
      <Button
        onClick={onDownloadPdf}
        variant="outline"
        disabled={isDownloading}
        className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
      >
        <Download className="h-4 w-4" />
        {isDownloading ? "Descargando..." : "Descargar PDF"}
      </Button>
      
      <Button
        onClick={onSendEmail}
        variant="outline"
        disabled={isSendingEmail}
        className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
      >
        <Mail className="h-4 w-4" />
        {isSendingEmail ? "Enviando..." : "Enviar por Email"}
      </Button>
      
      <Button
        onClick={onShareInvoice}
        variant="outline"
        disabled={isSharing}
        className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
      >
        <Share2 className="h-4 w-4" />
        {isSharing ? "Compartiendo..." : "Compartir"}
      </Button>
      
      {invoice.status === "pending" && (
        <Button
          onClick={onMarkAsPaid}
          variant="secondary"
          className="gap-1 bg-white text-seo-purple font-medium hover:bg-gray-100"
        >
          <Check className="h-4 w-4" />
          Marcar como Pagada
        </Button>
      )}
      
      <Link to={`/invoices/edit/${invoice.id}`}>
        <Button variant="outline" className="gap-1 bg-white text-seo-blue hover:bg-gray-100">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </Link>
      
      <DeleteInvoiceDialog 
        invoiceNumber={invoice.invoiceNumber} 
        onDelete={onDelete} 
      />
    </div>
  );
};
