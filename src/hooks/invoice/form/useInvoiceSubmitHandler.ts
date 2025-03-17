
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { createInvoice, updateInvoice } from "@/services/invoiceService";
import { InvoiceFormValues } from "@/components/invoice/InvoiceForm/invoiceSchema";

export const useInvoiceSubmitHandler = (
  isNewInvoice: boolean,
  invoice: Invoice | null,
  navigate: NavigateFunction,
  setIsSubmitting: (isSubmitting: boolean) => void,
  form: UseFormReturn<InvoiceFormValues>
) => {

  const onSubmit = async (data: InvoiceFormValues) => {
    if (!data.clientId || data.clientId === "no-clients") {
      toast.error("Debe seleccionar un cliente");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let result;
      
      const baseAmountValue = Number(data.baseAmount) || 0;
      const taxRateValue = Number(data.taxRate) || 0;
      const taxAmount = (baseAmountValue * taxRateValue) / 100;
      const totalAmount = baseAmountValue + taxAmount;
      
      console.log("Form submission - isNewInvoice:", isNewInvoice);
      console.log("Form data:", data);
      
      if (isNewInvoice) {
        const invoiceData = {
          clientId: data.clientId,
          packId: data.packId,
          proposalId: data.proposalId,
          baseAmount: baseAmountValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
          status: data.status,
          issueDate: data.issueDate,
          dueDate: data.dueDate || null,
          notes: data.notes || null,
          invoiceNumber: data.invoiceNumber || ''
        };
        
        console.log("Creating new invoice with data:", invoiceData);
        result = await createInvoice(invoiceData);
      } else {
        if (!invoice?.id) {
          throw new Error("Missing invoice ID for update");
        }
        
        const updateData = {
          id: invoice.id,
          clientId: data.clientId,
          packId: data.packId,
          proposalId: data.proposalId,
          baseAmount: baseAmountValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
          status: data.status,
          issueDate: data.issueDate,
          dueDate: data.dueDate || '',
          notes: data.notes || '',
          invoiceNumber: data.invoiceNumber || invoice?.invoiceNumber || "",
          pdfUrl: invoice?.pdfUrl || null,
          paymentDate: invoice?.paymentDate || null,
          createdAt: invoice?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log("Updating invoice with data:", updateData);
        result = await updateInvoice(updateData);
      }
      
      if (result) {
        console.log("Invoice saved successfully:", result);
        toast.success(isNewInvoice ? "Factura creada correctamente" : "Factura actualizada correctamente");
        navigate(`/invoices/${result.id}`);
      } else {
        throw new Error("No se pudo guardar la factura");
      }
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      toast.error(error.message || "Error al guardar la factura");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit };
};
