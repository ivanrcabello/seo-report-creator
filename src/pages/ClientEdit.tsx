
import { useParams, useNavigate } from "react-router-dom";
import { ClientForm } from "@/components/ClientForm";
import { useEffect, useState } from "react";
import { getClient, updateClient } from "@/services/clientService";
import { Client } from "@/types/client";
import { toast } from "sonner";

const ClientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        toast.error("ID de cliente no válido");
        navigate("/clients");
        return;
      }
      
      try {
        setIsLoading(true);
        const clientData = await getClient(id);
        if (clientData) {
          setClient(clientData);
        } else {
          toast.error("Cliente no encontrado");
          navigate("/clients");
        }
      } catch (error) {
        console.error("Error al cargar el cliente:", error);
        toast.error("No se pudo cargar la información del cliente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClient();
  }, [id, navigate]);
  
  const handleSubmit = async (data: any) => {
    try {
      if (!client) return;
      
      const updatedClient = {
        ...client,
        ...data
      };
      
      await updateClient(updatedClient);
      toast.success("Cliente actualizado correctamente");
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      toast.error("Error al guardar los cambios");
    }
  };
  
  const handleCancel = () => {
    navigate(`/clients/${id}`);
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
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <ClientForm 
        client={client || undefined} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
};

export default ClientEdit;
