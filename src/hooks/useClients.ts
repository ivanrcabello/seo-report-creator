
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  getClients, 
  getClient, 
  updateClient, 
  deleteClient, 
  updateClientActiveStatus, 
  createClient 
} from "@/services/clientService";
import { Client } from "@/types/client";
import { toast as sonnerToast } from "sonner";

export function useClients(clientId?: string) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const fetchedClients = await getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  // Initialize component based on URL params
  useEffect(() => {
    const initializeComponent = async () => {
      if (clientId === "new") {
        setIsEditMode(false);
        setCurrentClient(null);
      } else if (clientId && window.location.pathname.includes("/clients/edit/")) {
        setIsLoading(true);
        setIsEditMode(true);
        
        try {
          const client = await getClient(clientId);
          setCurrentClient(client);
        } catch (error) {
          console.error("Error fetching client for edit:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar los datos del cliente",
            variant: "destructive",
          });
          navigate("/clients");
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeComponent();
  }, [clientId, navigate, toast]);

  // Handlers
  const handleAddClient = () => {
    navigate("/clients/new");
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const handleCancelForm = () => {
    navigate("/clients");
  };

  const handleClientSubmit = async (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    try {
      if (isEditMode && currentClient) {
        const updatedClient = await updateClient(currentClient.id, {
          name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          isActive: currentClient.isActive
        });
        
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        sonnerToast.success(`Cliente ${updatedClient.name} actualizado correctamente`);
      } else {
        const newClient = await createClient({
          name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          isActive: true
        });
        
        setClients([...clients, newClient]);
        sonnerToast.success(`Cliente ${newClient.name} creado correctamente`);
      }
      
      navigate("/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      sonnerToast.error(
        isEditMode 
          ? "No se pudo actualizar el cliente. Inténtalo de nuevo."
          : "No se pudo crear el cliente. Inténtalo de nuevo."
      );
    }
  };

  const handleToggleClientStatus = async (clientId: string, isActive: boolean) => {
    try {
      const updatedClient = await updateClientActiveStatus(clientId, isActive);
      setClients(clients.map(c => c.id === clientId ? updatedClient : c));
      sonnerToast.success(`Cliente ${isActive ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error("Error updating client status:", error);
      sonnerToast.error(`No se pudo ${isActive ? 'activar' : 'desactivar'} el cliente`);
    }
  };

  const handleDeleteClientConfirm = async (clientId: string) => {
    try {
      const result = await deleteClient(clientId);
      
      if (result) {
        setClients(clients.filter(c => c.id !== clientId));
        sonnerToast.success(`Cliente eliminado correctamente`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting client:", error);
      return false;
    }
  };

  return {
    clients,
    isLoading,
    isEditMode,
    currentClient,
    handleAddClient,
    handleEditClient,
    handleCancelForm,
    handleClientSubmit,
    handleToggleClientStatus,
    handleDeleteClientConfirm
  };
}
