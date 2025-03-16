import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Invoice, Client } from "@/types/client";
import { getInvoice, createInvoice, updateInvoice } from "@/services/invoiceService";
import { getClient, getClients } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { FileSpreadsheet, Save, ArrowLeft } from "lucide-react";
import { format, addDays } from "date-fns";
import { ClientSelection } from "@/components/invoice/ClientSelection";
import { InvoiceStatus } from "@/components/invoice/InvoiceStatus";
import { DateFields } from "@/components/invoice/DateFields";
import { AmountFields } from "@/components/invoice/AmountFields";
import { AmountSummary } from "@/components/invoice/AmountSummary";
import { NotesField } from "@/components/invoice/NotesField";
import { InvoiceNumberField } from "@/components/invoice/InvoiceNumberField";
import { invoiceSchema } from "./invoiceSchema";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { InvoiceFormSkeleton } from "./InvoiceFormSkeleton";
import { InvoiceFormError } from "./InvoiceFormError";
import { InvoiceFormNoClients } from "./InvoiceFormNoClients";

type FormValues = z.infer<typeof invoiceSchema>;

export const InvoiceForm = () => {
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

  const form = useForm<FormValues>({
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
        setIsLoading(false);
      }
    };
    
    loadClients();
  }, [clientIdFromQuery, isNewInvoice]);

  useEffect(() => {
    const loadInvoiceData = async () => {
      if (isNewInvoice) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Loading invoice data for:", id);
        const data = await getInvoice(id);
        if (data) {
          console.log("Retrieved invoice data:", data);
          setInvoice(data);
          const clientData = await getClient(data.clientId);
          if (clientData) {
            setClient(clientData);
          }
          
          const issueDate = data.issueDate ? format(new Date(data.issueDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
          const dueDate = data.dueDate ? format(new Date(data.dueDate), "yyyy-MM-dd") : format(addDays(new Date(), 30), "yyyy-MM-dd");
          
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
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
        setError("No se pudo cargar la factura");
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
      }
    } catch (error) {
      console.error("Error loading client:", error);
      toast.error("No se pudo cargar la información del cliente");
    }
  };

  const onSubmit = async (data: FormValues) => {
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
          ...data,
          number: data.invoiceNumber || '',
          clientName: client?.name || 'Unknown Client',
          baseAmount: baseAmountValue,
          subtotal: baseAmountValue,
          tax: taxRateValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
          total: totalAmount,
          date: data.issueDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          paidAt: null
        };
        
        result = await createInvoice(invoiceData as any);
      } else {
        if (!id) {
          throw new Error("Missing invoice ID for update");
        }
        
        const updateData = {
          ...(invoice || {}),
          id,
          clientId: data.clientId,
          clientName: client?.name || invoice?.clientName || 'Unknown Client',
          packId: data.packId,
          proposalId: data.proposalId,
          baseAmount: baseAmountValue,
          subtotal: baseAmountValue,
          tax: taxRateValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
          total: totalAmount,
          status: data.status,
          issueDate: data.issueDate,
          date: data.issueDate,
          dueDate: data.dueDate || '',
          notes: data.notes || '',
          invoiceNumber: data.invoiceNumber || invoice?.invoiceNumber || "",
          number: data.invoiceNumber || invoice?.invoiceNumber || "",
          paymentDate: invoice?.paymentDate || null,
          paidAt: invoice?.paymentDate || null,
          pdfUrl: invoice?.pdfUrl || null,
          createdAt: invoice?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        result = await updateInvoice(updateData as any);
      }
      
      if (result) {
        toast.success(isNewInvoice ? "Factura creada correctamente" : "Factura actualizada correctamente");
        navigate(`/invoices/${result.id}`);
      } else {
        throw new Error("No se pudo guardar la factura");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Error al guardar la factura");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <InvoiceFormSkeleton isNewInvoice={isNewInvoice} invoice={invoice} />;
  }

  if (error) {
    return <InvoiceFormError error={error} onGoBack={() => navigate(-1)} />;
  }

  if (isNewInvoice && availableClients.length === 0) {
    return <InvoiceFormNoClients onGoBack={() => navigate(-1)} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <InvoiceFormHeader 
          isNewInvoice={isNewInvoice} 
          invoice={invoice} 
          client={client} 
          onGoBack={() => navigate(-1)} 
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientSelection 
                form={form} 
                isNewInvoice={isNewInvoice} 
                isLoading={isLoading}
                availableClients={availableClients}
                onClientChange={handleClientChange} 
              />
              <InvoiceStatus form={form} />
              
              {!isNewInvoice && (
                <InvoiceNumberField 
                  form={form} 
                  isNewInvoice={isNewInvoice} 
                  invoiceNumber={invoice?.invoiceNumber} 
                />
              )}
              
              <DateFields form={form} />
              
              <AmountFields form={form} />
              
              <AmountSummary 
                baseAmount={baseAmountNum} 
                taxRate={taxRateNum} 
                taxAmount={taxAmount} 
                totalAmount={totalAmount} 
              />
              
              <NotesField form={form} />
            </div>
            
            <Button 
              type="submit" 
              className="gap-2 mt-6"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : isNewInvoice ? "Crear Factura" : "Actualizar Factura"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
