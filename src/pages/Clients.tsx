
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientsList } from "@/components/ClientsList";
import { ClientForm } from "@/components/ClientForm";
import { getClients, getClient, updateClient, deleteClient, updateClientActiveStatus, createClient } from "@/services/clientService";
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
  const { toast: uiToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeComponent = async () => {
      if (params.id === "new") {
        setShowForm(true);
        setIsEditMode(false);
        setCurrentClient(null);
      } else if (params.id && window.location.pathname.includes("/clients/edit/")) {
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
    setDeleteError(null);
    setShowDeleteDialog(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      setIsDeleting(true);
      const result = await deleteClient(clientToDelete.id);
      
      if (result) {
        setClients(clients.filter(c => c.id !== clientToDelete.id));
        toast.success(`Cliente ${clientToDelete.name} eliminado correctamente`);
        setShowDeleteDialog(false);
        setClientToDelete(null);
      } else {
        setDeleteError("No se pudo eliminar el cliente");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      setDeleteError("No se pudo eliminar el cliente");
    } finally {
      setIsDeleting(false);
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
        toast.success(`Cliente ${updatedClient.name} actualizado correctamente`);
      } else {
        const newClient = await createClient({
          name: clientData.name,
          email: clientData.email,
          company: clientData.company,
          isActive: true
        });
        
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

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteError(null);
    setClientToDelete(null);
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

      <AlertDialog open={showDeleteDialog} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {!deleteError ? (
                "Esta acción eliminará al cliente " + clientToDelete?.name + " y no se puede deshacer. Todos los datos asociados a este cliente serán eliminados permanentemente."
              ) : (
                <span className="text-red-500 font-medium">{deleteError}</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancelar
            </AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction 
                onClick={confirmDeleteClient}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
