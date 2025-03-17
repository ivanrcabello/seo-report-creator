
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format, addDays } from "date-fns";

import { invoiceSchema, InvoiceFormValues } from "./invoiceSchema";
import { useInvoiceFormState } from "@/hooks/invoice/form/useInvoiceFormState";
import { useInvoiceCalculations } from "@/hooks/invoice/form/useInvoiceCalculations";
import { useInvoiceClientHandler } from "@/hooks/invoice/form/useInvoiceClientHandler";
import { useInvoiceDataLoader } from "@/hooks/invoice/form/useInvoiceDataLoader";
import { useInvoiceSubmitHandler } from "@/hooks/invoice/form/useInvoiceSubmitHandler";

export function useInvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    invoice, setInvoice,
    client, setClient,
    availableClients, setAvailableClients,
    isLoading, setIsLoading,
    isSubmitting, setIsSubmitting,
    error, setError
  } = useInvoiceFormState();

  const isNewInvoice = !id || id === "new";
  
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromQuery = queryParams.get('clientId');

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: clientIdFromQuery || "",
      baseAmount: 0,
      taxRate: 21,
      status: "draft",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
      notes: "",
      invoiceNumber: "",
    },
  });

  const { baseAmountNum, taxRateNum, taxAmount, totalAmount } = useInvoiceCalculations(form);

  const { handleClientChange } = useInvoiceClientHandler(
    clientIdFromQuery, 
    isNewInvoice, 
    setClient, 
    setAvailableClients, 
    setError, 
    setIsLoading
  );

  useInvoiceDataLoader(
    id, 
    isNewInvoice, 
    form, 
    setInvoice, 
    setClient, 
    setIsLoading, 
    setError
  );

  const { onSubmit } = useInvoiceSubmitHandler(
    isNewInvoice, 
    invoice, 
    navigate, 
    setIsSubmitting, 
    form
  );

  return {
    form,
    invoice,
    client,
    availableClients,
    isLoading,
    isSubmitting,
    isNewInvoice,
    error,
    baseAmountNum,
    taxRateNum,
    taxAmount,
    totalAmount,
    handleClientChange,
    onSubmit,
    navigate
  };
}
