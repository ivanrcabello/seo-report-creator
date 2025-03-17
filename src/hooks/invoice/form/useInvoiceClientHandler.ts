
import { useEffect } from "react";
import { toast } from "sonner";
import { getClients, getClient } from "@/services/clientService";

export const useInvoiceClientHandler = (
  clientIdFromQuery: string | null,
  isNewInvoice: boolean,
  setClient: (client: any) => void,
  setAvailableClients: (clients: any[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {

  // Load clients data
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
        if (isNewInvoice) {
          setIsLoading(false);
        }
      }
    };
    
    loadClients();
  }, [clientIdFromQuery, isNewInvoice, setAvailableClients, setClient, setError, setIsLoading]);

  const handleClientChange = async (clientId: string) => {
    if (!clientId || clientId === "no-clients") return;
    
    try {
      console.log("Loading client data for selected client:", clientId);
      const clientData = await getClient(clientId);
      if (clientData) {
        setClient(clientData);
        console.log("Client data set:", clientData);
      }
    } catch (error) {
      console.error("Error loading client:", error);
      toast.error("No se pudo cargar la información del cliente");
    }
  };

  return {
    handleClientChange
  };
};
