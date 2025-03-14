
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { Invoice, Client } from "@/types/client";
import { getInvoice, createInvoice, updateInvoice } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getSeoPack } from "@/services/packService";
import { getProposal } from "@/services/proposal/proposalCrud";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  FileSpreadsheet, 
  Save, 
  ArrowLeft,
  Calendar,
  Euro
} from "lucide-react";
import { format, addDays } from "date-fns";

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
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewInvoice = !id || id === "new";

  const form = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
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
              {/* Campo de Cliente */}
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ID del cliente"
                        disabled={!isNewInvoice || isLoading}
                        onChange={(e) => {
                          field.onChange(e);
                          handleClientChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo de Estado */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="paid">Pagada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Fecha de Emisión */}
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Emisión</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Fecha de Vencimiento */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Importe Base */}
              <FormField
                control={form.control}
                name="baseAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importe Base (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tipo de IVA */}
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de IVA (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Resumen de Importes (solo visual) */}
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Imponible:</span>
                  <span className="font-medium">{baseAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA ({taxRate}%):</span>
                  <span className="font-medium">{taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-blue-700 font-bold text-lg">{totalAmount.toFixed(2)} €</span>
                </div>
              </div>
              
              {/* Notas */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas o comentarios adicionales para la factura"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
