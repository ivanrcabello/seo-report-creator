
import { useState, useEffect } from "react";
import { ShareInvoiceResult } from "@/types/invoiceTypes";
import { getInvoiceByShareToken } from "@/services/invoiceService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const useInvoiceShare = (token: string | undefined) => {
  const [invoice, setInvoice] = useState<ShareInvoiceResult['invoice']>(null);
  const [client, setClient] = useState<ShareInvoiceResult['client']>(null);
  const [company, setCompany] = useState<ShareInvoiceResult['company']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: es });
  };

  const fetchInvoiceByToken = async () => {
    if (!token) {
      setError("No se proporcionó token de factura");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching invoice with token:", token);
      setLoading(true);
      setIsRetrying(false);
      
      const result = await getInvoiceByShareToken(token);
      
      if (!result || !result.invoice) {
        setError("Factura no encontrada");
        setLoading(false);
        return;
      }
      
      setInvoice(result.invoice);
      setClient(result.client);
      setCompany(result.company);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching shared invoice:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceByToken();
  }, [token]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchInvoiceByToken();
  };

  return {
    invoice,
    client,
    company,
    loading,
    error,
    isRetrying,
    handleRetry,
    formatCurrency,
    formatDate
  };
};
