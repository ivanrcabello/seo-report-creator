
import { InvoiceDetailContainer } from "@/components/invoice/detail";
import { InvoiceLoadingState } from "@/components/invoice/detail";
import { InvoiceErrorState } from "@/components/invoice/detail";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { useState } from "react";
import { toast } from "sonner";

const InvoiceDetail = () => {
  const {
    invoice,
    client,
    company,
    packName,
    loading,
    error,
    handleDeleteInvoice,
    handleMarkAsPaid,
    handleDownloadPdf,
    isPdfGenerating,
    formatCurrency,
    formatDate,
    handleGoBack
  } = useInvoiceDetail();

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      // Implement email sending functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Factura enviada por email correctamente");
    } catch (error) {
      toast.error("Error al enviar la factura por email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareInvoice = async () => {
    setIsSharing(true);
    try {
      // Implement share functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Enlace de factura generado correctamente");
    } catch (error) {
      toast.error("Error al generar enlace");
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) return <InvoiceLoadingState />;
  if (error || !invoice) return <InvoiceErrorState error={error} />;

  return (
    <InvoiceDetailContainer
      invoice={invoice}
      client={client}
      company={company}
      packName={packName}
      onDelete={handleDeleteInvoice}
      onMarkAsPaid={handleMarkAsPaid}
      onDownloadPdf={handleDownloadPdf}
      onSendEmail={handleSendEmail}
      onShareInvoice={handleShareInvoice}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
      isPdfGenerating={isPdfGenerating}
      isSendingEmail={isSendingEmail}
      isSharing={isSharing}
      onGoBack={handleGoBack}
    />
  );
};

export default InvoiceDetail;
