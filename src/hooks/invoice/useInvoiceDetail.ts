
import { useParams } from "react-router-dom";
import { useInvoiceData } from "./useInvoiceData";
import { useInvoiceActions } from "./useInvoiceActions";
import { useInvoiceFormatters } from "./useInvoiceFormatters";
import { useInvoiceState } from "./useInvoiceState";

export const useInvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isPdfGenerating, setIsPdfGenerating, invoice: stateInvoice, setInvoice } = useInvoiceState();
  const { invoice: dataInvoice, client, company, packName, loading, error } = useInvoiceData(id);
  const { formatCurrency, formatDate } = useInvoiceFormatters();
  
  // Use the invoice from data if state invoice is null
  const invoice = stateInvoice || dataInvoice;
  
  // If dataInvoice changes and stateInvoice is null, update stateInvoice
  if (dataInvoice && !stateInvoice) {
    setInvoice(dataInvoice);
  }
  
  const actions = useInvoiceActions(id, setInvoice);

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
    formatDate
  };
};
