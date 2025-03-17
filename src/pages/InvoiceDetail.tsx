
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoice, markInvoiceAsPaid, deleteInvoice } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceDetailsCard } from "@/components/invoice/InvoiceDetailsCard";
import { InvoiceDetailHeader } from "@/components/invoice/InvoiceDetailHeader";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileSpreadsheet, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch invoice
        const invoiceData = await getInvoice(id);
        if (!invoiceData) {
          throw new Error("Invoice not found");
        }
        setInvoice(invoiceData);

        // Fetch client data
        if (invoiceData.clientId) {
          const clientData = await getClient(invoiceData.clientId);
          setClient(clientData || null);
        }

        // Fetch company settings
        const companyData = await getCompanySettings();
        setCompany(companyData || null);

        // Fetch package name if applicable
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
        // Refresh invoice data
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
    // TODO: Implement PDF download
    toast.info("Función de descarga en desarrollo");
  };

  const handleSendEmail = async () => {
    // TODO: Implement email sending
    toast.info("Función de envío por email en desarrollo");
  };

  const getStatusBadge = () => {
    if (!invoice) return null;
    
    const statusColors = {
      draft: "bg-gray-200 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    const color = statusColors[invoice.status as keyof typeof statusColors] || statusColors.draft;
    
    return (
      <Badge className={color}>
        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
      </Badge>
    );
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
            statusBadge={getStatusBadge()}
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
    </div>
  );
}
