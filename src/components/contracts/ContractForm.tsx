
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SeoContract, Client, ContractSection } from "@/types/client";
import { getClient, getClients } from "@/services/clientService";
import { getContract, createContract, updateContract, createDefaultContractSections } from "@/services/contractService";
import { getCompanySettings } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { contractFormSchema, ContractFormValues } from "./ContractFormSchema";
import { GeneralInfoTab } from "./form/GeneralInfoTab";
import { PartiesTab } from "./form/PartiesTab";
import { SectionsTab } from "./form/SectionsTab";

interface ContractFormProps {
  clientId?: string;
  contractId?: string;
}

export const ContractFormComponent = ({ clientId: propClientId, contractId: propContractId }: ContractFormProps) => {
  const { id: paramId, clientId: paramClientId } = useParams<{ id: string; clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<ContractSection[]>([]);

  // Establecer prioridad: prop > param para clientId
  const clientId = propClientId || paramClientId;
  // Establecer prioridad: prop > param para id del contrato
  const id = propContractId || paramId;

  console.log("ContractForm: Using clientId:", clientId, "from prop:", propClientId, "from param:", paramClientId);
  console.log("ContractForm: Using contractId:", id, "from prop:", propContractId, "from param:", paramId);

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
        const clientsData = await getClients();
        setClients(clientsData);

        const settings = await getCompanySettings();

        if (settings) {
          form.setValue("professionalInfo.name", settings.companyName);
          form.setValue("professionalInfo.company", settings.companyName);
          form.setValue("professionalInfo.address", settings.address);
          form.setValue("professionalInfo.taxId", settings.taxId);
        }

        if (id) {
          console.log("Fetching contract data for id:", id);
          const contractData = await getContract(id);
          
          if (contractData) {
            console.log("Contract data loaded:", contractData.title);
            form.setValue("title", contractData.title);
            form.setValue("clientId", contractData.clientId);
            form.setValue("startDate", new Date(contractData.startDate));
            if (contractData.endDate) {
              form.setValue("endDate", new Date(contractData.endDate));
            }
            form.setValue("phase1Fee", contractData.phase1Fee);
            form.setValue("monthlyFee", contractData.monthlyFee);
            form.setValue("status", contractData.status as any);
            
            if (contractData.content.clientInfo) {
              const clientInfo = {
                name: contractData.content.clientInfo.name || "",
                company: contractData.content.clientInfo.company || "",
                address: contractData.content.clientInfo.address || "",
                taxId: contractData.content.clientInfo.taxId || "",
              };
              form.setValue("clientInfo", clientInfo);
            }
            
            if (contractData.content.professionalInfo) {
              const professionalInfo = {
                name: contractData.content.professionalInfo.name || "",
                company: contractData.content.professionalInfo.company || "",
                address: contractData.content.professionalInfo.address || "",
                taxId: contractData.content.professionalInfo.taxId || "",
              };
              form.setValue("professionalInfo", professionalInfo);
            }
            
            setSections(contractData.content.sections || []);
          } else {
            console.error("Contract not found for id:", id);
            toast({
              title: "Error",
              description: "No se encontró el contrato",
              variant: "destructive",
            });
          }
        } else if (clientId) {
          console.log("Fetching client data for clientId:", clientId);
          const clientData = await getClient(clientId);
          
          if (clientData) {
            console.log("Client data loaded:", clientData.name);
            form.setValue("clientId", clientId);
            form.setValue("clientInfo.name", clientData.name);
            form.setValue("clientInfo.company", clientData.company || "");
          } else {
            console.error("Client not found for clientId:", clientId);
          }
          
          const defaultSections = createDefaultContractSections();
          console.log("Using default sections, count:", defaultSections.length);
          setSections(defaultSections);
        } else {
          console.log("No clientId or contractId provided, using default sections");
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

  const onSubmit = async (values: ContractFormValues) => {
    try {
      setSaving(true);
      console.log("Submitting form with values:", values.title, values.clientId);

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
          clientInfo: {
            name: values.clientInfo.name || "",
            company: values.clientInfo.company || "",
            address: values.clientInfo.address || "",
            taxId: values.clientInfo.taxId || "",
          },
          professionalInfo: {
            name: values.professionalInfo.name || "",
            company: values.professionalInfo.company || "",
            address: values.professionalInfo.address || "",
            taxId: values.professionalInfo.taxId || "",
          },
        },
        signedByClient: false,
        signedByProfessional: false,
      };

      if (id) {
        console.log("Updating contract:", id);
        await updateContract({
          ...contractData,
          id,
          createdAt: "",
          updatedAt: "",
        });
        
        toast({
          title: "Contrato actualizado",
          description: "El contrato ha sido actualizado correctamente",
        });
      } else {
        console.log("Creating new contract for client:", values.clientId);
        const newContract = await createContract(contractData);
        console.log("New contract created with id:", newContract.id);
        
        toast({
          title: "Contrato creado",
          description: "El contrato ha sido creado correctamente",
        });
      }
      
      // Redireccionar al cliente si hay un clientId, o a la lista de contratos si no
      if (values.clientId) {
        navigate(`/clients/${values.clientId}?tab=contracts`);
      } else {
        navigate("/contracts");
      }
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
              
              <TabsContent value="general">
                <GeneralInfoTab form={form} clients={clients} clientId={clientId} />
              </TabsContent>
              
              <TabsContent value="parties">
                <PartiesTab form={form} />
              </TabsContent>
              
              <TabsContent value="sections">
                <SectionsTab sections={sections} onChange={setSections} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(clientId ? `/clients/${clientId}?tab=contracts` : "/contracts")}
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

export const ContractForm = ContractFormComponent;
