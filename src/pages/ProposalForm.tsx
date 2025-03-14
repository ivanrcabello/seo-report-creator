
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProposal, 
  createProposalFromPack, 
  addProposal, 
  updateProposal, 
  sendProposal 
} from "@/services/proposalService";
import { getClients } from "@/services/clientService";
import { getSeoPacks } from "@/services/packService";
import { toast } from "sonner";
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
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Package,
  Euro,
  CheckCircle
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SeoPack } from "@/types/client";

// Schema de validación para el formulario de propuesta
const proposalFormSchema = z.object({
  clientId: z.string().min(1, "Debes seleccionar un cliente"),
  packId: z.string().min(1, "Debes seleccionar un paquete"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  useCustomPrice: z.boolean().default(false),
  customPrice: z.coerce.number().optional(),
  useCustomFeatures: z.boolean().default(false),
  customFeatures: z.string().optional()
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

const ProposalForm = () => {
  const { id, clientId, packId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedPack, setSelectedPack] = useState<SeoPack | null>(null);
  const isNew = !id || id === "new";

  // Obtener todos los clientes
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  // Obtener todos los paquetes activos
  const { data: packages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: getSeoPacks
  });

  // Obtener la propuesta si estamos editando
  const { data: proposal, isLoading: isLoadingProposal } = useQuery({
    queryKey: ["proposal", id],
    queryFn: () => getProposal(id!),
    enabled: !!id && id !== "new"
  });

  // Formulario para crear/editar propuestas
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      clientId: clientId || "",
      packId: packId || "",
      title: "",
      description: "",
      useCustomPrice: false,
      customPrice: undefined,
      useCustomFeatures: false,
      customFeatures: ""
    }
  });

  // Actualizar el formulario cuando se carga la propuesta
  useEffect(() => {
    // Si estamos en modo edición y tenemos una propuesta
    if (!isNew && proposal) {
      form.reset({
        clientId: proposal.clientId,
        packId: proposal.packId,
        title: proposal.title,
        description: proposal.description,
        useCustomPrice: !!proposal.customPrice,
        customPrice: proposal.customPrice,
        useCustomFeatures: !!proposal.customFeatures,
        customFeatures: proposal.customFeatures ? proposal.customFeatures.join("\n") : ""
      });

      // Establecer el paquete seleccionado
      const pack = packages.find(p => p.id === proposal.packId);
      if (pack) {
        setSelectedPack(pack);
      }
    }
    // Si estamos en modo creación con clientId y packId en params
    else if (isNew && clientId && packId) {
      form.setValue("clientId", clientId);
      form.setValue("packId", packId);
      
      // Establecer el paquete seleccionado
      const pack = packages.find(p => p.id === packId);
      if (pack) {
        setSelectedPack(pack);
        const client = clients.find(c => c.id === clientId);
        if (client && pack) {
          form.setValue("title", `Propuesta ${pack.name} para ${client.name}`);
        }
      }
    }
  }, [proposal, packages, clients, form, isNew, clientId, packId]);

  // Mutación para crear una propuesta
  const createProposalMutation = useMutation({
    mutationFn: (data: ProposalFormValues) => {
      const { useCustomPrice, useCustomFeatures, ...restData } = data;
      
      return createProposalFromPack(
        restData.clientId,
        restData.packId,
        restData.title,
        restData.description,
        useCustomPrice ? restData.customPrice : undefined,
        useCustomFeatures && restData.customFeatures 
          ? restData.customFeatures.split("\n").map(item => item.trim()).filter(Boolean)
          : undefined
      )!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta creada correctamente");
      navigate("/proposals");
    },
    onError: (error) => {
      toast.error("Error al crear la propuesta");
      console.error(error);
    }
  });

  // Mutación para actualizar una propuesta
  const updateProposalMutation = useMutation({
    mutationFn: (data: ProposalFormValues) => {
      if (!proposal) return Promise.reject("No se encontró la propuesta");

      const { useCustomPrice, useCustomFeatures, ...restData } = data;
      
      return updateProposal({
        ...proposal,
        clientId: restData.clientId,
        packId: restData.packId,
        title: restData.title,
        description: restData.description,
        customPrice: useCustomPrice ? restData.customPrice : undefined,
        customFeatures: useCustomFeatures && restData.customFeatures 
          ? restData.customFeatures.split("\n").map(item => item.trim()).filter(Boolean)
          : undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      toast.success("Propuesta actualizada correctamente");
      navigate("/proposals");
    },
    onError: (error) => {
      toast.error("Error al actualizar la propuesta");
      console.error(error);
    }
  });

  // Mutación para enviar una propuesta
  const sendProposalMutation = useMutation({
    mutationFn: () => sendProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      toast.success("Propuesta enviada correctamente");
      navigate(`/proposals/${id}`);
    },
    onError: (error) => {
      toast.error("Error al enviar la propuesta");
      console.error(error);
    }
  });

  // Función para manejar el envío del formulario
  const onSubmit = (data: ProposalFormValues) => {
    if (!isNew) {
      updateProposalMutation.mutate(data);
    } else {
      createProposalMutation.mutate(data);
    }
  };

  // Función para enviar la propuesta
  const handleSendProposal = () => {
    if (id && confirm("¿Estás seguro de que quieres enviar esta propuesta al cliente?")) {
      sendProposalMutation.mutate();
    }
  };

  // Actualizar el paquete seleccionado cuando cambia el packId
  const onPackChange = (packId: string) => {
    const pack = packages.find(p => p.id === packId);
    setSelectedPack(pack || null);
    
    // Si hay un paquete seleccionado y estamos creando, actualizar el título
    if (pack && isNew) {
      const client = clients.find(c => c.id === form.getValues("clientId"));
      if (client) {
        form.setValue("title", `Propuesta ${pack.name} para ${client.name}`);
      }
    }
  };

  // Carga de la página
  const isLoading = isLoadingClients || isLoadingPackages || (!isNew && isLoadingProposal);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-100 rounded mb-4 max-w-md"></div>
          <div className="h-96 bg-gray-100 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/proposals")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">
          {!isNew ? "Editar Propuesta" : "Nueva Propuesta"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Propuesta</CardTitle>
              <CardDescription>
                Completa la información de la propuesta para el cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="proposal-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Actualizar el título si hay un cliente y paquete seleccionados
                              const pack = packages.find(p => p.id === form.getValues("packId"));
                              const client = clients.find(c => c.id === value);
                              if (pack && client && isNew) {
                                form.setValue("title", `Propuesta ${pack.name} para ${client.name}`);
                              }
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paquete SEO</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              onPackChange(value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un paquete" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {packages.map((pack) => (
                                <SelectItem key={pack.id} value={pack.id}>
                                  {pack.name} - €{pack.price.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de la Propuesta</FormLabel>
                        <FormControl>
                          <Input placeholder="ej. Propuesta SEO Premium para Cliente ABC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe brevemente la propuesta..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPack && (
                    <>
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <FormField
                            control={form.control}
                            name="useCustomPrice"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Personalizar precio
                                  </FormLabel>
                                  <FormDescription>
                                    Establece un precio diferente al del paquete
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("useCustomPrice") && (
                          <FormField
                            control={form.control}
                            name="customPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Precio Personalizado (€, IVA incluido)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    min="0" 
                                    placeholder={`Precio original: €${selectedPack.price.toFixed(2)}`}
                                    {...field}
                                    value={field.value === undefined ? "" : field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="flex items-start gap-2 mt-4">
                          <FormField
                            control={form.control}
                            name="useCustomFeatures"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Personalizar características
                                  </FormLabel>
                                  <FormDescription>
                                    Modifica las características incluidas en el paquete
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("useCustomFeatures") && (
                          <FormField
                            control={form.control}
                            name="customFeatures"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Características Personalizadas</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    className="min-h-[120px]"
                                    placeholder={`Características originales:\n${selectedPack.features.join("\n")}`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Escribe cada característica en una línea separada
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate("/proposals")}
              >
                Cancelar
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  form="proposal-form"
                  className="gap-1"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
                {!isNew && proposal?.status === "draft" && (
                  <Button 
                    onClick={handleSendProposal}
                    className="gap-1"
                    variant="secondary"
                  >
                    <Send className="h-4 w-4" />
                    Enviar al Cliente
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          {selectedPack && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  {selectedPack.name}
                </CardTitle>
                <CardDescription>{selectedPack.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-2xl font-bold text-purple-700 flex items-center">
                  <Euro className="h-5 w-5 mr-1" />
                  {selectedPack.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-500 ml-1">(IVA incluido)</span>
                </div>

                <h4 className="font-semibold mb-2">Características incluidas:</h4>
                <ul className="space-y-2">
                  {selectedPack.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
