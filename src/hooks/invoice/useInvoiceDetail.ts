
import { useParams, useNavigate } from "react-router-dom";
import { useInvoiceData } from "./useInvoiceData";
import { useInvoiceActions } from "./useInvoiceActions";
import { useInvoiceFormatters } from "./useInvoiceFormatters";
import { useInvoiceState } from "./useInvoiceState";
import { useAuth } from "@/contexts/AuthContext";

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

  // Custom navigation handling
  const handleGoBack = () => {
    if (invoice) {
      if (!isAdmin && user?.id) {
        // If a client is viewing their own invoice, navigate to their dashboard's invoices tab
        navigate(`/clients/${user.id}?tab=invoices`);
      } else if (isAdmin) {
        // If an admin is viewing an invoice, navigate based on the context
        navigate(
          invoice.clientId 
            ? `/clients/${invoice.clientId}?tab=invoices` 
            : '/invoices'
        );
      } else {
        // Fallback
        navigate('/invoices');
      }
    } else {
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
