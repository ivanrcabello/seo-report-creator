
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientForm } from "@/components/ClientForm";
import { ClientReports } from "@/components/ClientReports";
import { PdfUploader } from "@/components/PdfUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getClient, 
  updateClient, 
  deleteClient, 
  getClientReports,
  addReport
} from "@/services/clientService";
import { Client, ClientReport } from "@/types/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, UserCog, FileText, UploadCloud } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("profile");

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

  const handlePdfAnalysis = (result: AuditResult) => {
    if (client && id) {
      try {
        // Create a new report from the analysis result
        const currentDate = new Date().toISOString();
        const newReport = addReport({
          title: `Auditoría SEO - ${format(new Date(), "d MMM yyyy", { locale: es })}`,
          type: "seo", 
          date: currentDate,
          clientId: id,
          notes: `Informe generado automáticamente a partir de un PDF el ${format(new Date(), "d MMMM yyyy", { locale: es })}`,
        });
        
        // Update the reports list
        setReports([...reports, newReport]);
        
        toast({
          title: "Informe creado",
          description: "Informe generado correctamente desde el PDF.",
        });
        
        // Navigate to the report page with the audit data
        navigate(`/report`, { state: { auditResult: result } });
      } catch (error) {
        console.error("Error al crear informe:", error);
        toast({
          title: "Error",
          description: "No se pudo crear el informe. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-4 grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Informes
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <UploadCloud className="h-4 w-4" />
            Subir PDF
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Nombre</h3>
                  <p>{client.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Email</h3>
                  <p>{client.email}</p>
                </div>
                {client.phone && (
                  <div>
                    <h3 className="font-medium text-gray-700">Teléfono</h3>
                    <p>{client.phone}</p>
                  </div>
                )}
                {client.company && (
                  <div>
                    <h3 className="font-medium text-gray-700">Empresa</h3>
                    <p>{client.company}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-700">Fecha de registro</h3>
                  <p>{format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Último informe</h3>
                  <p>{client.lastReport ? format(new Date(client.lastReport), "d 'de' MMMM, yyyy", { locale: es }) : "Sin informes"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <ClientReports 
            reports={reports} 
            clientName={client.name}
            onAddReport={handleAddReport}
          />
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-blue-600" />
                Subir informe PDF
              </CardTitle>
              <CardDescription>
                Sube un PDF de auditoría para analizar y generar automáticamente un informe para {client.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PdfUploader onAnalysisComplete={handlePdfAnalysis} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
