
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { InvoiceDetailHeader } from "@/components/invoice/InvoiceDetailHeader";
import { StatusBadge } from "@/components/invoice/detail";
import { InvoiceContent } from "@/components/invoice/detail/InvoiceContent";
import { InvoiceDetailContainer } from "@/components/invoice/detail/InvoiceDetailContainer";
import { InvoiceLoadingState } from "@/components/invoice/detail/InvoiceLoadingState";
import { InvoiceErrorState } from "@/components/invoice/detail/InvoiceErrorState";
import { ShareInvoiceDialog } from "@/components/invoice/detail/ShareInvoiceDialog";

export default function InvoiceDetail() {
  const {
    invoice,
    client,
    company,
    packName,
    loading,
    error,
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
  } = useInvoiceDetail();

  return (
    <InvoiceDetailContainer>
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
          
          <InvoiceContent 
            invoice={invoice}
            client={client}
            company={company}
            packName={packName}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </>
      )}
      
      {loading && <InvoiceLoadingState />}
      
      {error && !loading && <InvoiceErrorState error={error} />}

      <ShareInvoiceDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen} 
        shareUrl={shareUrl} 
      />
    </InvoiceDetailContainer>
  );
}
