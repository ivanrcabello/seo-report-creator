
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClient, getClients } from "@/services/clientService";
import { getSeoPacks } from "@/services/packService";
import { createProposalFromPack } from "@/services/proposalService";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

// Schema de validación para el formulario
const proposalFormSchema = z.object({
  clientId: z.string().min(1, "El cliente es obligatorio"),
  packId: z.string().min(1, "El paquete es obligatorio"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  customPrice: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export default function ProposalForm() {
  const navigate = useNavigate();
  const { clientId: clientIdParam } = useParams<{ clientId?: string }>();
  const [searchParams] = useSearchParams();
  const preselectedClientId = clientIdParam || searchParams.get("clientId") || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar clientes
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  // Cargar paquetes
  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: getSeoPacks
  });

  // Cargar cliente preseleccionado
  const { data: preselectedClient } = useQuery({
    queryKey: ["client", preselectedClientId],
    queryFn: () => preselectedClientId ? getClient(preselectedClientId) : null,
    enabled: !!preselectedClientId
  });

  // Configurar formulario
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      clientId: "",
      packId: "",
      title: "",
      description: "",
      customPrice: "",
      additionalNotes: "",
    },
  });

  // Prellenar el cliente si viene por parámetro
  useEffect(() => {
    if (preselectedClientId && preselectedClient) {
      form.setValue("clientId", preselectedClientId);
      form.setValue("title", `Propuesta para ${preselectedClient.name}`);
      form.setValue("description", `Propuesta personalizada para ${preselectedClient.name} basada en sus necesidades específicas.`);
    }
  }, [preselectedClientId, preselectedClient, form]);

  // Manejar envío del formulario
  const onSubmit = async (data: z.infer<typeof proposalFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      const customPrice = data.customPrice ? parseFloat(data.customPrice) : undefined;
      
      const proposal = await createProposalFromPack(
        data.clientId,
        data.packId,
        data.title,
        data.description,
        customPrice,
        undefined,
        data.additionalNotes
      );
      
      if (proposal) {
        toast.success("Propuesta creada correctamente");
        navigate(`/proposals/${proposal.id}`);
      } else {
        toast.error("No se pudo crear la propuesta");
      }
    } catch (error) {
      console.error("Error al crear propuesta:", error);
      toast.error("Error al crear la propuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Propuesta</h1>
        <Button variant="outline" onClick={() => navigate("/proposals")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Propuesta</CardTitle>
        </CardHeader>
        <CardContent>
          {(isLoadingClients || isLoadingPackages) ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Selección de cliente */}
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!!preselectedClientId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} {client.company ? `- ${client.company}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Selección de paquete */}
                  <FormField
                    control={form.control}
                    name="packId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paquete</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un paquete" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packages.map((pack) => (
                              <SelectItem key={pack.id} value={pack.id}>
                                {pack.name} - {pack.price}€
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Título de la propuesta */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de la propuesta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Descripción de la propuesta */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descripción detallada de la propuesta" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notas adicionales para el contenido AI */}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas adicionales para el contenido AI</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Instrucciones o información adicional que quieras incluir en la propuesta generada por IA" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Precio personalizado (opcional) */}
                <FormField
                  control={form.control}
                  name="customPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio personalizado (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Dejar vacío para usar el precio del paquete" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar Propuesta
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
