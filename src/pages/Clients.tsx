
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@/types/client";
import { useClients } from "@/hooks/useClients";
import ClientsList from "@/components/ClientsList";
import { ClientForm } from "@/components/ClientForm";
import { DeleteClientDialog } from "@/components/clients/DeleteClientDialog";

const Clients = () => {
  const params = useParams();
  const [showForm, setShowForm] = useState(params.id === "new" || window.location.pathname.includes("/clients/edit/"));
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    clients,
    isLoading,
    currentClient,
    isEditMode,
    handleAddClient,
    handleEditClient,
    handleCancelForm,
    handleClientSubmit,
    handleToggleClientStatus,
    handleDeleteClientConfirm
  } = useClients(params.id);

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setClientToDelete(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    handleCancelForm();
  };

  const handleFormSubmit = async (data: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    await handleClientSubmit(data);
    setShowForm(false);
  };

  const handleAddNewClient = () => {
    setShowForm(true);
    handleAddClient();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        {showForm ? (
          <div className="animate-fadeIn">
            <ClientForm 
              client={currentClient || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <ClientsList 
              clients={clients} 
              onAddClient={handleAddNewClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
              onToggleStatus={handleToggleClientStatus}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <DeleteClientDialog
        client={clientToDelete}
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteClientConfirm}
      />
    </div>
  );
};

export default Clients;
