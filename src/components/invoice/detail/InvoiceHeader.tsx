
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";
import { HeaderLeftSection } from "./HeaderLeftSection";
import { useState } from "react";
import { ShareInvoiceDialog } from "./ShareInvoiceDialog";
import { DeleteInvoiceDialog } from "./DeleteInvoiceDialog";
import { useAuth } from "@/contexts/AuthContext";

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
  onGoBack,
}: InvoiceHeaderProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isAdmin } = useAuth();

  const handleShareInvoice = async () => {
    setShowShareDialog(true);
  };

  const handleDeleteInvoice = async () => {
    setShowDeleteDialog(true);
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 mb-6">
      <HeaderLeftSection invoice={invoice} onGoBack={onGoBack} />
      
      {isAdmin && (
        <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end">
          {invoice.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAsPaid}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              Marcar como Pagada
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="bg-white"
          >
            {isDownloading ? "Generando..." : "Descargar PDF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSendEmail}
            disabled={isSendingEmail}
            className="bg-white"
          >
            {isSendingEmail ? "Enviando..." : "Enviar por Email"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareInvoice}
            disabled={isSharing}
            className="bg-white"
          >
            {isSharing ? "Compartiendo..." : "Compartir"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteInvoice}
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          >
            Eliminar
          </Button>
        </div>
      )}

      <ShareInvoiceDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        onConfirm={onShareInvoice}
        isSharing={isSharing}
      />
      <DeleteInvoiceDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={onDelete}
      />
    </div>
  );
};
