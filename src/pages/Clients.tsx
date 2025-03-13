
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientsList } from "@/components/ClientsList";
import { ClientForm } from "@/components/ClientForm";
import { getClients, addClient } from "@/services/clientService";
import { Client } from "@/types/client";

const Clients = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [clients, setClients] = useState<Client[]>(getClients());

  const handleAddClient = () => {
    setShowAddForm(true);
  };

  const handleCancelAddClient = () => {
    setShowAddForm(false);
  };

  const handleClientSubmit = (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    try {
      const newClient = addClient(clientData);
      setClients([...clients, newClient]);
      setShowAddForm(false);
      toast({
        title: "Cliente creado",
        description: `${newClient.name} ha sido añadido correctamente.`,
      });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el cliente. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Clientes</h1>
      
      {showAddForm ? (
        <div className="mb-8">
          <ClientForm 
            onSubmit={handleClientSubmit}
            onCancel={handleCancelAddClient}
          />
        </div>
      ) : (
        <ClientsList 
          clients={clients} 
          onAddClient={handleAddClient} 
        />
      )}
    </div>
  );
};

export default Clients;
