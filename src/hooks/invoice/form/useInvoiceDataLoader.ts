
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { getInvoice } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { InvoiceFormValues } from "@/components/invoice/InvoiceForm/invoiceSchema";

export const useInvoiceDataLoader = (
  id: string | undefined,
  isNewInvoice: boolean,
  form: UseFormReturn<InvoiceFormValues>,
  setInvoice: (invoice: any) => void,
  setClient: (client: any) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void
) => {

  // Load invoice data (for edit mode)
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (isNewInvoice) {
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Loading invoice data for:", id);
        const data = await getInvoice(id!);
        console.log("Invoice data loaded:", data);
        
        if (data) {
          setInvoice(data);
          
          if (data.clientId) {
            console.log("Loading client data for invoice:", data.clientId);
            const clientData = await getClient(data.clientId);
            if (clientData) {
              setClient(clientData);
              console.log("Client data loaded:", clientData);
            }
          }
          
          // Format dates properly for form inputs
          const issueDate = data.issueDate 
            ? format(new Date(data.issueDate), "yyyy-MM-dd") 
            : format(new Date(), "yyyy-MM-dd");
            
          const dueDate = data.dueDate 
            ? format(new Date(data.dueDate), "yyyy-MM-dd") 
            : format(new Date(new Date().setDate(new Date().getDate() + 30)), "yyyy-MM-dd");
          
          console.log("Setting form values with:", {
            clientId: data.clientId,
            packId: data.packId,
            proposalId: data.proposalId,
            baseAmount: data.baseAmount,
            taxRate: data.taxRate,
            status: data.status,
            issueDate: issueDate,
            dueDate: dueDate,
            notes: data.notes || "",
            invoiceNumber: data.invoiceNumber,
          });
          
          // Reset form with invoice data
          form.reset({
            clientId: data.clientId,
            packId: data.packId,
            proposalId: data.proposalId,
            baseAmount: data.baseAmount,
            taxRate: data.taxRate,
            status: data.status,
            issueDate: issueDate,
            dueDate: dueDate,
            notes: data.notes || "",
            invoiceNumber: data.invoiceNumber,
          });
        } else {
          throw new Error("No se encontró la factura");
        }
      } catch (error: any) {
        console.error("Error loading invoice:", error);
        setError(error.message || "No se pudo cargar la factura");
        toast.error("No se pudo cargar la factura");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoiceData();
  }, [id, isNewInvoice, form, setInvoice, setClient, setIsLoading, setError]);
};
