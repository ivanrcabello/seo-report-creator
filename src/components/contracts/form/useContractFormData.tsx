
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeoContract } from "@/types/client";
import { getClient, getClients } from "@/services/clientService";
import { 
  getContract, 
  createContract, 
  updateContract, 
  createDefaultContractSections 
} from "@/services/contractService";
import { getCompanySettings } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";
import { useContractForm } from "./ContractFormContext";
import { ContractFormValues } from "../ContractFormSchema";

export const useContractFormData = () => {
  const { 
    form, 
    setSections, 
    sections, 
    setSaving, 
    setLoading, 
    clientId, 
    contractId 
  } = useContractForm();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching clients data...");
        const clientsData = await getClients();
        console.log("Clients data loaded, count:", clientsData.length);

        console.log("Fetching company settings...");
        const settings = await getCompanySettings();

        if (settings) {
          console.log("Company settings loaded");
          form.setValue("professionalInfo.name", settings.companyName);
          form.setValue("professionalInfo.company", settings.companyName);
          form.setValue("professionalInfo.address", settings.address);
          form.setValue("professionalInfo.taxId", settings.taxId);
        }

        if (contractId) {
          console.log("Fetching contract data for contractId:", contractId);
          const contractData = await getContract(contractId);
          
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
            console.error("Contract not found for contractId:", contractId);
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
            form.setValue("title", `Contrato de Servicios SEO - ${clientData.name}`);
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
  }, [contractId, clientId, form, toast, setSections, setLoading]);

  const handleSubmit = async (values: ContractFormValues) => {
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

      if (contractId) {
        console.log("Updating contract:", contractId);
        await updateContract({
          ...contractData,
          id: contractId,
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

  return {
    handleSubmit,
    clients: [] // This will be filled by the useClients hook
  };
};

// A small hook to fetch clients data
export const useClients = () => {
  const [clients, setClients] = useState([]);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    
    fetchClients();
  }, []);
  
  return clients;
};
