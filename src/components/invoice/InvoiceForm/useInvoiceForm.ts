
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoice, createInvoice, updateInvoice } from "@/services/invoiceService";
import { getClient, getClients } from "@/services/clientService";
import { invoiceSchema, InvoiceFormValues } from "./invoiceSchema";

export function useInvoiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const baseAmount = form.watch("baseAmount");
  const taxRate = form.watch("taxRate");
  
  const baseAmountNum = Number(baseAmount) || 0;
  const taxRateNum = Number(taxRate) || 0;
  const taxAmount = (baseAmountNum * taxRateNum) / 100;
  const totalAmount = baseAmountNum + taxAmount;

  // Load clients data
  useEffect(() => {
    const loadClients = async () => {
      try {
        console.log("Loading clients...");
        const clients = await getClients();
        console.log("Clients loaded:", clients);
        setAvailableClients(clients);
        
        if (clientIdFromQuery && isNewInvoice) {
          console.log("Loading client data for:", clientIdFromQuery);
          const clientData = await getClient(clientIdFromQuery);
          if (clientData) {
            setClient(clientData);
          }
        }
      } catch (error) {
        console.error("Error loading clients:", error);
        setError("No se pudieron cargar los clientes");
        toast.error("No se pudieron cargar los clientes");
      } finally {
        if (isNewInvoice) {
          setIsLoading(false);
        }
      }
    };
    
    loadClients();
  }, [clientIdFromQuery, isNewInvoice]);

  // Load invoice data (for edit mode)
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (isNewInvoice) {
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Loading invoice data for:", id);
        const data = await getInvoice(id);
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
            : format(addDays(new Date(), 30), "yyyy-MM-dd");
          
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
  }, [id, isNewInvoice, form]);
  
  const handleClientChange = async (clientId: string) => {
    if (!clientId || clientId === "no-clients") return;
    
    try {
      console.log("Loading client data for selected client:", clientId);
      const clientData = await getClient(clientId);
      if (clientData) {
        setClient(clientData);
        console.log("Client data set:", clientData);
      }
    } catch (error) {
      console.error("Error loading client:", error);
      toast.error("No se pudo cargar la información del cliente");
    }
  };

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
        if (!id) {
          throw new Error("Missing invoice ID for update");
        }
        
        const updateData = {
          id,
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
