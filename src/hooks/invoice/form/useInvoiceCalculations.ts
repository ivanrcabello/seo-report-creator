
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/components/invoice/InvoiceForm/invoiceSchema";

export const useInvoiceCalculations = (form: UseFormReturn<InvoiceFormValues>) => {
  const baseAmount = form.watch("baseAmount");
  const taxRate = form.watch("taxRate");
  
  const baseAmountNum = Number(baseAmount) || 0;
  const taxRateNum = Number(taxRate) || 0;
  const taxAmount = (baseAmountNum * taxRateNum) / 100;
  const totalAmount = baseAmountNum + taxAmount;

  return {
    baseAmountNum,
    taxRateNum,
    taxAmount,
    totalAmount
  };
};
