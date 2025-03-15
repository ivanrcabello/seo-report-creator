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
import { ClientSelection } from "./invoice/ClientSelection";
import { InvoiceStatus } from "./invoice/InvoiceStatus";
import { DateFields } from "./invoice/DateFields";
import { AmountFields } from "./invoice/AmountFields";
import { AmountSummary } from "./invoice/AmountSummary";
import { NotesField } from "./invoice/NotesField";
import { InvoiceNumberField } from "./invoice/InvoiceNumberField";

const invoiceSchema = z.object({
  clientId: z.string().uuid("El cliente es obligatorio"),
  packId: z.string().uuid("El paquete es obligatorio").optional(),
  proposalId: z.string().uuid("La propuesta es obligatoria").optional(),
  baseAmount: z.coerce.number().min(0, "El importe base no puede ser negativo"),
  taxRate: z.coerce.number().min(0, "El tipo de IVA no puede ser negativo").default(21),
  status: z.enum(["draft", "pending", "paid", "cancelled"]),
  issueDate: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

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
          setInvoice(data);
          const clientData = await getClient(data.clientId);
          if (clientData) {
            setClient(clientData);
          }
          
          form.reset({
            clientId: data.clientId,
            packId: data.packId,
            proposalId: data.proposalId,
            baseAmount: data.baseAmount,
            taxRate: data.taxRate,
            status: data.status,
            issueDate: format(new Date(data.issueDate), "yyyy-MM-dd"),
            dueDate: data.dueDate ? format(new Date(data.dueDate), "yyyy-MM-dd") : undefined,
            notes: data.notes,
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
      
      if (isNewInvoice) {
        result = await createInvoice({
          ...data,
          baseAmount: baseAmountValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
        } as any);
      } else {
        result = await updateInvoice({
          ...invoice,
          ...data,
          baseAmount: baseAmountValue,
          taxRate: taxRateValue,
          taxAmount,
          totalAmount,
        } as Invoice);
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
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              {isNewInvoice ? "Nueva Factura" : `Editando Factura ${invoice?.invoiceNumber}`}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <CardDescription>
            {isNewInvoice ? "Cargando datos..." : `Cargando factura...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando información...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Error
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Se produjo un error al cargar los datos</p>
            <Button onClick={() => navigate(-1)} className="gap-1">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isNewInvoice && availableClients.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Nueva Factura
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <CardDescription>
            No hay clientes disponibles para crear facturas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Debe crear al menos un cliente antes de poder crear facturas</p>
            <Button onClick={() => navigate("/clients/new")} className="gap-1">
              Crear Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            {isNewInvoice ? "Nueva Factura" : `Editando Factura ${invoice?.invoiceNumber}`}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <CardDescription>
          {isNewInvoice 
            ? "Crea una nueva factura para un cliente" 
            : `Factura para ${client?.name}`}
        </CardDescription>
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
