
import { useState, useEffect } from "react";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoice } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";

export const useInvoiceData = (id: string | undefined) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [packName, setPackName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const invoiceData = await getInvoice(id);
        if (!invoiceData) {
          throw new Error("Invoice not found");
        }
        setInvoice(invoiceData);

        if (invoiceData.clientId) {
          const clientData = await getClient(invoiceData.clientId);
          setClient(clientData || null);
        }

        const companyData = await getCompanySettings();
        setCompany(companyData || null);

        if (invoiceData.packId) {
          // Implement if you have a getPackage service
          // const packData = await getPackage(invoiceData.packId);
          // setPackName(packData ? packData.name : null);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching invoice data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { invoice, client, company, packName, loading, error };
};
