
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientsList } from "@/components/ClientsList";
import { ClientForm } from "@/components/ClientForm";
import { getClients, addClient, getClient, updateClient, deleteClient, updateClientActiveStatus } from "@/services/clientService";
import { Client } from "@/types/client";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Clients = () => {
  const { toast: uiToast } = useToast(); // Rename to avoid confusion with sonner's toast
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
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
          uiToast({
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
  }, [params.id, navigate, uiToast]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const fetchedClients = await getClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        uiToast({
          title: "Error",
          description: "No se pudieron cargar los clientes. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [uiToast]);

  const handleAddClient = () => {
    setShowForm(true);
    setIsEditMode(false);
    setCurrentClient(null);
    navigate("/clients/new");
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete.id);
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast.success(`Cliente ${clientToDelete.name} eliminado correctamente`);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("No se pudo eliminar el cliente");
    } finally {
      setShowDeleteDialog(false);
      setClientToDelete(null);
    }
  };

  const handleToggleClientStatus = async (clientId: string, isActive: boolean) => {
    try {
      const updatedClient = await updateClientActiveStatus(clientId, isActive);
      setClients(clients.map(c => c.id === clientId ? updatedClient : c));
      toast.success(`Cliente ${isActive ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error("Error updating client status:", error);
      toast.error(`No se pudo ${isActive ? 'activar' : 'desactivar'} el cliente`);
    }
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
          company: clientData.company,
          isActive: currentClient.isActive
        };
        
        // Call updateClient with the complete client object
        const updatedClient = await updateClient(updatedClientData);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        toast.success(`Cliente ${updatedClient.name} actualizado correctamente`);
      } else {
        // Create new client
        const newClient = await addClient(clientData);
        setClients([...clients, newClient]);
        toast.success(`Cliente ${newClient.name} creado correctamente`);
      }
      
      setShowForm(false);
      navigate("/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error(
        isEditMode 
          ? "No se pudo actualizar el cliente. Inténtalo de nuevo."
          : "No se pudo crear el cliente. Inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        {showForm ? (
          <div className="animate-fadeIn">
            <ClientForm 
              client={currentClient || undefined}
              onSubmit={handleClientSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <ClientsList 
              clients={clients} 
              onAddClient={handleAddClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
              onToggleStatus={handleToggleClientStatus}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al cliente {clientToDelete?.name} y no se puede deshacer.
              Todos los datos asociados a este cliente serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
