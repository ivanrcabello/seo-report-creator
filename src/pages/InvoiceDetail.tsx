
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoice, markInvoiceAsPaid, deleteInvoice, downloadInvoicePdf, sendInvoiceByEmail, generateInvoicePdf } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvoiceDetailsCard } from "@/components/invoice/InvoiceDetailsCard";
import { InvoiceDetailHeader } from "@/components/invoice/InvoiceDetailHeader";
import { StatusBadge } from "@/components/invoice/detail";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { shareInvoice } from "@/services/invoice/pdf/pdfOperations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function InvoiceDetail() {
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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: es });
  };

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

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="container mx-auto py-8">
      {invoice && (
        <>
          <InvoiceDetailHeader 
            invoice={invoice}
            onDelete={handleDeleteInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onDownloadPdf={handleDownloadPdf}
            onSendEmail={handleSendEmail}
            onShareInvoice={handleShareInvoice}
            isDownloading={isPdfDownloading}
            isSendingEmail={isSendingEmail}
            isSharing={isSharing}
            statusBadge={<StatusBadge status={invoice.status} />}
            onGoBack={() => navigate("/invoices")}
          />
          
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
        </>
      )}
      
      {loading && (
        <div className="flex items-center justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Cargando factura...</span>
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center my-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate("/invoices")}>Volver a Facturas</Button>
        </div>
      )}

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir Factura</DialogTitle>
            <DialogDescription>
              Comparte este enlace con tu cliente para que pueda ver la factura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              value={shareUrl || ""}
              readOnly
              className="flex-1"
            />
            <Button type="submit" onClick={copyToClipboard}>
              Copiar
            </Button>
          </div>
          <div className="p-4 bg-blue-50 rounded-md my-4 border border-blue-100">
            <p className="text-sm text-blue-800">
              El cliente podrá ver la factura usando este enlace. No se requiere inicio de sesión.
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsShareDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
