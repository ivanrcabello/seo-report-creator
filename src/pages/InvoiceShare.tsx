
import { useParams } from "react-router-dom";
import { useInvoiceShare } from "@/hooks/useInvoiceShare";
import { 
  InvoiceShareLoading, 
  InvoiceShareError, 
  InvoiceShareNotFound,
  InvoiceSharedContent
} from "@/components/invoice/share";

export default function InvoiceShare() {
  const { token } = useParams<{ token: string }>();
  const { 
    invoice, 
    client, 
    company, 
    loading, 
    error, 
    isRetrying, 
    handleRetry,
    formatCurrency,
    formatDate
  } = useInvoiceShare(token);

  if (loading) {
    return <InvoiceShareLoading />;
  }

  if (error) {
    return (
      <InvoiceShareError 
        error={error} 
        isRetrying={isRetrying} 
        onRetry={handleRetry} 
      />
    );
  }

  if (!invoice) {
    return <InvoiceShareNotFound />;
  }

  return (
    <InvoiceSharedContent
      invoice={invoice}
      client={client}
      company={company}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
    />
  );
}
