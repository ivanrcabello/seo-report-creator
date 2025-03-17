
import { useState } from "react";
import { Invoice } from "@/types/invoice";

export const useInvoiceState = () => {
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  
  return {
    isPdfGenerating, 
    setIsPdfGenerating,
    invoice,
    setInvoice
  };
};
