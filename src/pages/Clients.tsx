
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientsList } from "@/components/ClientsList";
import { ClientForm } from "@/components/ClientForm";
import { getClients, addClient, getClient, updateClient } from "@/services/clientService";
import { Client } from "@/types/client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Clients = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  // Check if we're on the "new" or "edit" route
  useEffect(() => {
    const initializeComponent = async () => {
      if (params.id === "new") {
        setShowForm(true);
        setIsEditMode(false);
        setCurrentClient(null);
      } else if (params.id && window.location.pathname.includes("/clients/edit/")) {
        // We're editing a client
        setIsLoading(true);
        setIsEditMode(true);
        setShowForm(true);
        
        try {
          const client = await getClient(params.id);
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
  }, [params.id, navigate, toast]);

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

  const handleAddClient = () => {
    setShowForm(true);
    setIsEditMode(false);
    setCurrentClient(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    // Navigate back to clients list
    navigate("/clients");
  };

  const handleClientSubmit = async (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    try {
      if (isEditMode && currentClient) {
        // Update existing client - combine the current client data with the updated fields
        const updatedClientData = {
          ...currentClient,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company
        };
        
        // Call updateClient with the complete client object
        const updatedClient = await updateClient(updatedClientData);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        toast({
          title: "Cliente actualizado",
          description: `${updatedClient.name} ha sido actualizado correctamente.`,
        });
      } else {
        // Create new client
        const newClient = await addClient(clientData);
        setClients([...clients, newClient]);
        toast({
          title: "Cliente creado",
          description: `${newClient.name} ha sido añadido correctamente.`,
        });
      }
      
      setShowForm(false);
      navigate("/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: "Error",
        description: isEditMode 
          ? "No se pudo actualizar el cliente. Inténtalo de nuevo."
          : "No se pudo crear el cliente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Clientes</h1>
      
      {showForm ? (
        <div className="mb-8">
          <ClientForm 
            client={currentClient || undefined}
            onSubmit={handleClientSubmit}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <ClientsList 
          clients={clients} 
          onAddClient={handleAddClient}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Clients;
