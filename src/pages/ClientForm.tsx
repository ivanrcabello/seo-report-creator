
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientForm as ClientFormComponent } from "@/components/ClientForm";
import { getClient, updateClient, createClient } from "@/services/clientService";
import { toast } from "sonner";
import { Client } from "@/types/client";

export default function ClientForm() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(!!clientId);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return;
      
      try {
        setIsLoading(true);
        const clientData = await getClient(clientId);
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast.error("No se pudo cargar la información del cliente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [clientId]);
  
  const handleSubmit = async (data: any) => {
    try {
      if (clientId) {
        await updateClient(clientId, data);
        toast.success("Cliente actualizado correctamente");
      } else {
        await createClient(data);
        toast.success("Cliente creado correctamente");
      }
      navigate("/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Error al guardar los datos del cliente");
    }
  };
  
  const handleCancel = () => {
    navigate(clientId ? `/clients/${clientId}` : "/clients");
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <ClientFormComponent 
        client={client || undefined} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
}
