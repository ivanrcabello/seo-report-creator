
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@/types/client";
import { Invoice, CompanySettings } from "@/types/invoice";
import { 
  getInvoice, 
  markInvoiceAsPaid, 
  deleteInvoice, 
  downloadInvoicePdf,
  sendInvoiceByEmail 
} from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { getSeoPack } from "@/services/packService";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InvoiceDetailHeader } from "@/components/invoice/InvoiceDetailHeader";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { InvoiceDetailsCard } from "@/components/invoice/InvoiceDetailsCard";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";

export const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [packName, setPackName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const invoiceData = await getInvoice(id);
        if (!invoiceData) {
          toast.error("Factura no encontrada");
          navigate("/invoices");
          return;
        }
        
        setInvoice(invoiceData as Invoice);
        
        if (invoiceData.clientId) {
          const clientData = await getClient(invoiceData.clientId);
          if (clientData) {
            setClient(clientData);
          }
        }
        
        const companyData = await getCompanySettings();
        if (companyData) {
          setCompany(companyData as CompanySettings);
        }
        
        if (invoiceData.packId) {
          const packData = await getSeoPack(invoiceData.packId);
          if (packData) {
            setPackName(packData.name);
          }
        }
      } catch (error) {
        console.error("Error loading invoice details:", error);
        toast.error("Error al cargar los datos de la factura");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoiceData();
  }, [id, navigate]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsProcessing(true);
      const success = await deleteInvoice(id);
      if (success) {
        toast.success("Factura eliminada correctamente");
        navigate("/invoices");
      } else {
        throw new Error("No se pudo eliminar la factura");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Error al eliminar la factura");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleMarkAsPaid = async () => {
    if (!id || !invoice) return;
    
    try {
      setIsProcessing(true);
      const updatedInvoice = await markInvoiceAsPaid(id);
      if (updatedInvoice) {
        setInvoice(updatedInvoice as Invoice);
        toast.success("Factura marcada como pagada");
      } else {
        throw new Error("No se pudo actualizar el estado de la factura");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Error al actualizar el estado de la factura");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id || !invoice) return;
    
    try {
      setIsProcessing(true);
      toast.info("Generando PDF de la factura...");
      const success = await downloadInvoicePdf(id);
      if (success) {
        toast.success("PDF generado correctamente");
      } else {
        throw new Error("No se pudo generar el PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al generar el PDF de la factura");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!id || !invoice || !client) return;
    
    try {
      setIsProcessing(true);
      toast.info(`Enviando factura a ${client.email}...`);
      const success = await sendInvoiceByEmail(id);
      if (!success) {
        throw new Error("No se pudo enviar el email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error al enviar la factura por email");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Volver
          </button>
          <h1 className="text-2xl font-bold">Cargando factura...</h1>
        </div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => navigate("/invoices")}
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Volver
          </button>
          <h1 className="text-2xl font-bold">Factura no encontrada</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <InvoiceDetailHeader 
          invoice={invoice}
          onDelete={handleDelete}
          onMarkAsPaid={handleMarkAsPaid}
          onDownloadPdf={handleDownloadPdf}
          onSendEmail={handleSendEmail}
          statusBadge={<InvoiceStatusBadge status={invoice.status} />}
          onGoBack={() => navigate(-1)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InvoiceDetailsCard 
            invoice={invoice}
            client={client}
            company={company}
            packName={packName}
            formatCurrency={formatCurrency}
          />
          
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

export default InvoiceDetail;
