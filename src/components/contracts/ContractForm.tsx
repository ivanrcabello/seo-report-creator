
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SeoContract, Client, ContractSection } from "@/types/client";
import { getClient, getClients } from "@/services/clientService";
import { getContract, createContract, updateContract, createDefaultContractSections } from "@/services/contractService";
import { getCompanySettings } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format, parse } from "date-fns";

// Schema for the form validation
const contractFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  clientId: z.string().min(1, "El cliente es obligatorio"),
  startDate: z.date(),
  endDate: z.date().optional(),
  phase1Fee: z.coerce.number().min(0, "El importe debe ser mayor o igual a 0"),
  monthlyFee: z.coerce.number().min(0, "El importe debe ser mayor o igual a 0"),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  clientInfo: z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    company: z.string().optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
  }),
  professionalInfo: z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    company: z.string().min(1, "La empresa es obligatoria"),
    address: z.string().min(1, "La dirección es obligatoria"),
    taxId: z.string().min(1, "El CIF/NIF es obligatorio"),
  }),
  sections: z.array(
    z.object({
      title: z.string().min(1, "El título de la sección es obligatorio"),
      content: z.string().min(1, "El contenido de la sección es obligatorio"),
      order: z.number(),
    })
  ),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

export const ContractForm = () => {
  const { id, clientId } = useParams<{ id: string; clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<ContractSection[]>([]);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      title: "",
      clientId: clientId || "",
      startDate: new Date(),
      phase1Fee: 0,
      monthlyFee: 0,
      status: "draft",
      clientInfo: {
        name: "",
        company: "",
        address: "",
        taxId: "",
      },
      professionalInfo: {
        name: "",
        company: "",
        address: "",
        taxId: "",
      },
      sections: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients for dropdown
        const clientsData = await getClients();
        setClients(clientsData);

        // Fetch company settings for professional info
        const settings = await getCompanySettings();

        if (settings) {
          form.setValue("professionalInfo.name", settings.companyName);
          form.setValue("professionalInfo.company", settings.companyName);
          form.setValue("professionalInfo.address", settings.address);
          form.setValue("professionalInfo.taxId", settings.taxId);
        }

        // If editing existing contract
        if (id) {
          const contractData = await getContract(id);
          
          if (contractData) {
            // Set form values from contract data
            form.setValue("title", contractData.title);
            form.setValue("clientId", contractData.clientId);
            form.setValue("startDate", new Date(contractData.startDate));
            if (contractData.endDate) {
              form.setValue("endDate", new Date(contractData.endDate));
            }
            form.setValue("phase1Fee", contractData.phase1Fee);
            form.setValue("monthlyFee", contractData.monthlyFee);
            form.setValue("status", contractData.status as any);
            
            // Set client info
            if (contractData.content.clientInfo) {
              form.setValue("clientInfo", contractData.content.clientInfo);
            }
            
            // Set professional info
            if (contractData.content.professionalInfo) {
              form.setValue("professionalInfo", contractData.content.professionalInfo);
            }
            
            // Set sections
            setSections(contractData.content.sections);
          }
        } else if (clientId) {
          // If creating a new contract for a specific client
          const clientData = await getClient(clientId);
          
          if (clientData) {
            form.setValue("clientId", clientId);
            form.setValue("clientInfo.name", clientData.name);
            form.setValue("clientInfo.company", clientData.company || "");
          }
          
          // Set default sections for new contract
          setSections(createDefaultContractSections());
        } else {
          // New contract without specified client
          setSections(createDefaultContractSections());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, clientId, form, toast]);

  const addSection = () => {
    const newOrder = sections.length ? Math.max(...sections.map(s => s.order)) + 1 : 1;
    setSections([
      ...sections,
      {
        title: "",
        content: "",
        order: newOrder,
      },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index: number, field: keyof ContractSection, value: string | number) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    setSections(newSections);
  };

  const handleClientChange = async (clientId: string) => {
    if (clientId) {
      try {
        const clientData = await getClient(clientId);
        
        if (clientData) {
          form.setValue("clientInfo.name", clientData.name);
          form.setValue("clientInfo.company", clientData.company || "");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }
  };

  const onSubmit = async (values: ContractFormValues) => {
    try {
      setSaving(true);

      // Validate sections before submitting
      if (sections.some(section => !section.title || !section.content)) {
        toast({
          title: "Error",
          description: "Todas las secciones deben tener título y contenido",
          variant: "destructive",
        });
        return;
      }
      
      const contractData: Omit<SeoContract, "id" | "createdAt" | "updatedAt"> = {
        clientId: values.clientId,
        title: values.title,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        phase1Fee: values.phase1Fee,
        monthlyFee: values.monthlyFee,
        status: values.status,
        content: {
          sections: sections,
          clientInfo: values.clientInfo,
          professionalInfo: values.professionalInfo,
        },
        signedByClient: false,
        signedByProfessional: false,
      };

      if (id) {
        // Update existing contract
        await updateContract({
          ...contractData,
          id,
          createdAt: "", // These will be ignored by the update function
          updatedAt: "",
        });
        
        toast({
          title: "Contrato actualizado",
          description: "El contrato ha sido actualizado correctamente",
        });
      } else {
        // Create new contract
        const newContract = await createContract(contractData);
        
        toast({
          title: "Contrato creado",
          description: "El contrato ha sido creado correctamente",
        });
      }
      
      // Navigate back to contracts list
      navigate(clientId ? `/clients/${clientId}` : "/contracts");
    } catch (error) {
      console.error("Error saving contract:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el contrato",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{id ? "Editar Contrato" : "Nuevo Contrato"}</CardTitle>
            <CardDescription>
              {id
                ? "Modifica los detalles del contrato existente"
                : "Crea un nuevo contrato de servicios SEO"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="parties">Partes del Contrato</TabsTrigger>
                <TabsTrigger value="sections">Secciones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Contrato</FormLabel>
                      <FormControl>
                        <Input placeholder="Contrato de Servicios SEO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        disabled={!!clientId}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleClientChange(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} {client.company ? `(${client.company})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          mode="single"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Finalización (opcional)</FormLabel>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          mode="single"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="phase1Fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Importe Primera Fase (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="monthlyFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuota Mensual (€)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="parties" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Información del Cliente</h3>
                    
                    <FormField
                      control={form.control}
                      name="clientInfo.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre / Razón Social</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientInfo.company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa (opcional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientInfo.taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CIF/NIF (opcional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientInfo.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección (opcional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Información del Profesional</h3>
                    
                    <FormField
                      control={form.control}
                      name="professionalInfo.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre / Razón Social</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="professionalInfo.company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="professionalInfo.taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CIF/NIF</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="professionalInfo.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sections" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Secciones del Contrato</h3>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addSection}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir Sección
                  </Button>
                </div>
                
                {sections.map((section, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-start">
                        <Input
                          placeholder="Título de la sección"
                          value={section.title}
                          onChange={(e) => updateSection(index, "title", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(index)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Contenido de la sección"
                        value={section.content}
                        onChange={(e) => updateSection(index, "content", e.target.value)}
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                ))}
                
                {sections.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay secciones en el contrato.</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addSection}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir primera sección
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(clientId ? `/clients/${clientId}` : "/contracts")}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>{id ? "Actualizar" : "Crear"} Contrato</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
