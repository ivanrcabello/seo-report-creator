import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Invoice } from '@/types/invoice';
import { 
  generateInvoicePdf, 
  downloadInvoicePdf, 
  sendInvoiceByEmail, 
  shareInvoice, 
  deleteInvoice,
  markInvoiceAsPaid
} from '@/services/invoiceService';

export const useInvoiceActions = (id?: string, setInvoice?: React.Dispatch<React.SetStateAction<Invoice | null>>) => {
  const navigate = useNavigate();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleDeleteInvoice = async () => {
    if (!id) return;
    
    try {
      const success = await deleteInvoice(id);
      if (success) {
        toast.success('Factura eliminada correctamente');
        navigate('/invoices');
      } else {
        toast.error('Error al eliminar la factura');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Error al eliminar la factura');
    }
  };

  const handleMarkAsPaid = async () => {
    if (!id) return;
    
    try {
      const success = await markInvoiceAsPaid(id);
      if (success) {
        toast.success('Factura marcada como pagada');
        
        if (setInvoice) {
          const now = new Date().toISOString();
          setInvoice((prevInvoice) => {
            if (!prevInvoice) return null;
            
            return {
              ...prevInvoice,
              status: 'paid' as const,
              paymentDate: now,
              updatedAt: now
            };
          });
        }
      } else {
        toast.error('Error al marcar la factura como pagada');
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error('Error al marcar la factura como pagada');
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    
    setIsPdfDownloading(true);
    try {
      console.log("Triggering PDF download for invoice:", id);
      const success = await downloadInvoicePdf(id);
      
      if (!success) {
        toast.error('Error al descargar el PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!id) return;
    
    setIsSendingEmail(true);
    try {
      console.log("Sending invoice by email:", id);
      const success = await sendInvoiceByEmail(id);
      
      if (success) {
        toast.success('Factura enviada por email correctamente');
      } else {
        toast.error('Error al enviar la factura por email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar la factura por email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareInvoice = async () => {
    if (!id) return;
    
    setIsSharing(true);
    try {
      console.log("Sharing invoice:", id);
      const result = await shareInvoice(id);
      
      if (result && result.url) {
        setShareUrl(result.url);
        setIsShareDialogOpen(true);
      } else {
        toast.error('Error al compartir la factura');
      }
    } catch (error) {
      console.error('Error sharing invoice:', error);
      toast.error('Error al compartir la factura');
    } finally {
      setIsSharing(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!id) return;
    
    setIsPdfGenerating(true);
    try {
      console.log("Generating PDF for invoice:", id);
      const success = await generateInvoicePdf(id);
      
      if (success) {
        toast.success('PDF generado correctamente');
      } else {
        toast.error('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return {
    isPdfGenerating,
    isPdfDownloading,
    isSendingEmail,
    isSharing,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareUrl,
    handleDeleteInvoice,
    handleMarkAsPaid,
    handleDownloadPdf,
    handleSendEmail,
    handleShareInvoice,
    handleGeneratePdf,
    navigate
  };
};
