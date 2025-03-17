
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoice, markInvoiceAsPaid, deleteInvoice, downloadInvoicePdf, sendInvoiceByEmail, generateInvoicePdf } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { shareInvoice } from "@/services/invoice/pdf/pdfOperations";
import { toast } from "sonner";

export const useInvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [packName, setPackName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: es });
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const invoiceData = await getInvoice(id);
        if (!invoiceData) {
          throw new Error("Invoice not found");
        }
        setInvoice(invoiceData);

        if (invoiceData.clientId) {
          const clientData = await getClient(invoiceData.clientId);
          setClient(clientData || null);
        }

        const companyData = await getCompanySettings();
        setCompany(companyData || null);

        if (invoiceData.packId) {
          // Implement if you have a getPackage service
          // const packData = await getPackage(invoiceData.packId);
          // setPackName(packData ? packData.name : null);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching invoice data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMarkAsPaid = async () => {
    if (!id) return;

    setMarkingAsPaid(true);

    try {
      const success = await markInvoiceAsPaid(id);

      if (success) {
        toast.success("Factura marcada como pagada correctamente");
        setMarkingAsPaid(false);
        const updatedInvoice = await getInvoice(id);
        if (updatedInvoice) {
          setInvoice(updatedInvoice);
        }
      } else {
        throw new Error("Error al marcar la factura como pagada");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("No se pudo marcar la factura como pagada");
      setMarkingAsPaid(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteInvoice(id);
      
      if (success) {
        toast.success("Factura eliminada correctamente");
        navigate("/invoices");
      } else {
        throw new Error("Error al eliminar la factura");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("No se pudo eliminar la factura");
      setIsDeleting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;
    
    setIsPdfDownloading(true);
    try {
      // First check if the invoice has a PDF URL
      if (!invoice?.pdfUrl) {
        // Generate the PDF first if it doesn't exist
        toast.info("Generando PDF...");
        const generated = await generateInvoicePdf(id);
        if (!generated) {
          toast.error("Error al generar el PDF");
          setIsPdfDownloading(false);
          return;
        }
        
        // Refresh the invoice to get the PDF URL
        const updatedInvoice = await getInvoice(id);
        if (updatedInvoice) {
          setInvoice(updatedInvoice);
        }
      }
      
      // Now download the PDF
      const success = await downloadInvoicePdf(id);
      
      if (!success) {
        toast.error("Error al descargar el PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al descargar el PDF");
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!id) return;
    
    setIsSendingEmail(true);
    try {
      // First check if the invoice has a PDF URL
      if (!invoice?.pdfUrl) {
        // Generate the PDF first if it doesn't exist
        toast.info("Generando PDF para enviar por email...");
        const generated = await generateInvoicePdf(id);
        if (!generated) {
          toast.error("Error al generar el PDF para el email");
          setIsSendingEmail(false);
          return;
        }
        
        // Refresh the invoice to get the PDF URL
        const updatedInvoice = await getInvoice(id);
        if (updatedInvoice) {
          setInvoice(updatedInvoice);
        }
      }
      
      const success = await sendInvoiceByEmail(id);
      
      if (success) {
        toast.success("Factura enviada por email correctamente");
      } else {
        toast.error("Error al enviar el email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error al enviar el email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareInvoice = async () => {
    if (!id) return;
    
    setIsSharing(true);
    try {
      const result = await shareInvoice(id);
      if (result && result.url) {
        setShareUrl(result.url);
        setIsShareDialogOpen(true);
        toast.success("Enlace de factura generado correctamente");
      } else {
        toast.error("Error al compartir la factura");
      }
    } catch (error) {
      console.error("Error sharing invoice:", error);
      toast.error("Error al compartir la factura");
    } finally {
      setIsSharing(false);
    }
  };

  return {
    invoice,
    client,
    company,
    packName,
    loading,
    error,
    markingAsPaid,
    isDeleting,
    isPdfDownloading,
    isSendingEmail,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareUrl,
    isSharing,
    handleMarkAsPaid,
    handleDeleteInvoice,
    handleDownloadPdf,
    handleSendEmail,
    handleShareInvoice,
    formatCurrency,
    formatDate,
    navigate
  };
};
