
import { useState } from "react";
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";

export const useInvoiceFormState = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    invoice,
    setInvoice,
    client,
    setClient,
    availableClients,
    setAvailableClients,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    error,
    setError
  };
};
