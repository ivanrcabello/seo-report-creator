
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

// Schema de validación para las facturas
const invoiceSchema = z.object({
  clientId: z.string().uuid("El cliente es obligatorio"),
  packId: z.string().uuid("El paquete es obligatorio").optional(),
  proposalId: z.string().uuid("La propuesta es obligatoria").optional(),
  baseAmount: z.coerce.number().min(0, "El importe base no puede ser negativo"),
  taxRate: z.coerce.number().min(0, "El tipo de IVA no puede ser negativo").default(21),
  status: z.enum(["pending", "paid", "cancelled"]),
  issueDate: z.string(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof invoiceSchema>;

export const InvoiceForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewInvoice = !id || id === "new";
  
  // Get clientId from query params if available
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromQuery = queryParams.get('clientId');

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: clientIdFromQuery || "",
      baseAmount: 0,
      taxRate: 21,
      status: "pending",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
      notes: "",
    },
  });

  // Calcular automáticamente el IVA y total cuando cambia el importe base
  const baseAmount = form.watch("baseAmount");
  const taxRate = form.watch("taxRate");
  const taxAmount = (baseAmount * taxRate) / 100;
  const totalAmount = baseAmount + taxAmount;

  // Cargar la lista de clientes disponibles
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clients = await getClients();
        setAvailableClients(clients);
        
        // Si hay un clientId en la URL y estamos creando una nueva factura,
        // cargar los datos del cliente
        if (clientIdFromQuery && isNewInvoice) {
          const clientData = await getClient(clientIdFromQuery);
          if (clientData) {
            setClient(clientData);
          }
        }
      } catch (error) {
        console.error("Error loading clients:", error);
        toast.error("No se pudieron cargar los clientes");
      }
    };
    
    loadClients();
  }, [clientIdFromQuery, isNewInvoice]);

  // Cargar datos de la factura si se está editando
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (isNewInvoice) return;
      
      setIsLoading(true);
      try {
        const data = await getInvoice(id);
        if (data) {
          setInvoice(data);
          // Cargar datos del cliente
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
          });
        }
      } catch (error) {
        console.error("Error loading invoice:", error);
        toast.error("No se pudo cargar la factura");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoiceData();
  }, [id, isNewInvoice, form]);
  
  // Cargar datos del cliente cuando se selecciona uno
  const handleClientChange = async (clientId: string) => {
    try {
      const clientData = await getClient(clientId);
      if (clientData) {
        setClient(clientData);
      }
    } catch (error) {
      console.error("Error loading client:", error);
    }
  };

  // Envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      
      // Calcular impuestos
      const taxAmount = (data.baseAmount * data.taxRate) / 100;
      const totalAmount = data.baseAmount + taxAmount;
      
      if (isNewInvoice) {
        // Crear nueva factura
        result = await createInvoice({
          ...data,
          taxAmount,
          totalAmount,
        } as any);
      } else {
        // Actualizar factura existente
        result = await updateInvoice({
          ...invoice,
          ...data,
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
              {/* Cliente y Estado */}
              <ClientSelection 
                form={form} 
                isNewInvoice={isNewInvoice} 
                isLoading={isLoading}
                availableClients={availableClients}
                onClientChange={handleClientChange} 
              />
              <InvoiceStatus form={form} />
              
              {/* Fechas */}
              <DateFields form={form} />
              
              {/* Importes */}
              <AmountFields form={form} />
              
              {/* Resumen de Importes */}
              <AmountSummary 
                baseAmount={baseAmount} 
                taxRate={taxRate} 
                taxAmount={taxAmount} 
                totalAmount={totalAmount} 
              />
              
              {/* Notas */}
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
