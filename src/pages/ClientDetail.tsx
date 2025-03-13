
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientForm } from "@/components/ClientForm";
import { ClientReports } from "@/components/ClientReports";
import { 
  getClient, 
  updateClient, 
  deleteClient, 
  getClientReports
} from "@/services/clientService";
import { Client, ClientReport } from "@/types/client";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, UserCog } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundClient = getClient(id);
      if (foundClient) {
        setClient(foundClient);
        setReports(getClientReports(id));
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleEditClient = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateClient = (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    if (client) {
      try {
        const updatedClient = updateClient({
          ...client,
          ...clientData
        });
        setClient(updatedClient);
        setIsEditing(false);
        toast({
          title: "Cliente actualizado",
          description: `Los datos de ${updatedClient.name} han sido actualizados.`,
        });
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el cliente. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteClient = () => {
    if (client && window.confirm(`¿Estás seguro de eliminar a ${client.name}? Esta acción no se puede deshacer.`)) {
      try {
        deleteClient(client.id);
        toast({
          title: "Cliente eliminado",
          description: `${client.name} ha sido eliminado correctamente.`,
        });
        navigate("/clients");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddReport = () => {
    navigate(`/reports/new?clientId=${id}`);
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  if (!client) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <p className="text-gray-500 mb-4">Cliente no encontrado</p>
            <Link to="/clients">
              <Button variant="outline">Volver a Clientes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link to="/clients" className="mr-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Ficha de Cliente</h1>
      </div>

      {isEditing ? (
        <div className="mb-8">
          <ClientForm 
            client={client}
            onSubmit={handleUpdateClient}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{client.name}</CardTitle>
              <CardDescription className="text-base">
                <div className="flex flex-col space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{client.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Cliente desde {format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                </div>
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleEditClient} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteClient} className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="mt-8">
        <ClientReports 
          reports={reports} 
          clientName={client.name}
          onAddReport={handleAddReport}
        />
      </div>
    </div>
  );
};

export default ClientDetail;
