import { useParams, useNavigate } from "react-router-dom";
import { useInvoiceData } from "./useInvoiceData";
import { useInvoiceActions } from "./useInvoiceActions";
import { useInvoiceFormatters } from "./useInvoiceFormatters";
import { useInvoiceState } from "./useInvoiceState";
import { useAuth } from "@/contexts/auth";

export const useInvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isPdfGenerating, setIsPdfGenerating, invoice: stateInvoice, setInvoice } = useInvoiceState();
  const { invoice: dataInvoice, client, company, packName, loading, error } = useInvoiceData(id);
  const { formatCurrency, formatDate } = useInvoiceFormatters();
  const { isAdmin, user } = useAuth();
  
  // Use the invoice from data if state invoice is null
  const invoice = stateInvoice || dataInvoice;
  
  // If dataInvoice changes and stateInvoice is null, update stateInvoice
  if (dataInvoice && !stateInvoice) {
    setInvoice(dataInvoice);
  }
  
  const actions = useInvoiceActions(id, setInvoice);

  // Fixed navigation handling to respect user context
  const handleGoBack = () => {
    // If the invoice doesn't exist yet, just go to general invoices list
    if (!invoice) {
      navigate('/invoices');
      return;
    }

    console.log("Back navigation - user context:", { 
      isAdmin, 
      userId: user?.id, 
      invoiceClientId: invoice.clientId 
    });

    if (isAdmin) {
      // Admin users can navigate based on invoice context 
      if (invoice.clientId) {
        // Go to the specific client's invoices
        navigate(`/clients/${invoice.clientId}?tab=invoices`);
      } else {
        // Fallback to all invoices
        navigate('/invoices');
      }
    } else if (user?.id) {
      // Regular users can only go to their own invoices
      // Ensure we're navigating to the current user's invoices, not someone else's
      navigate(`/clients/${user.id}?tab=invoices`);
    } else {
      // Fallback
      navigate('/invoices');
    }
  };

  return {
    invoice,
    client,
    company,
    packName,
    loading,
    error,
    isPdfGenerating,
    ...actions,
    formatCurrency,
    formatDate,
    navigate,
    handleGoBack
  };
};
