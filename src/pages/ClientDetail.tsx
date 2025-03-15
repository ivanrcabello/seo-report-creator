
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientForm } from "@/components/ClientForm";
import { ClientReports } from "@/components/ClientReports";
import ClientDocuments from "@/components/ClientDocuments";
import { PdfUploader } from "@/components/PdfUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalSeoReportView } from "@/components/LocalSeoReportView";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";
import { 
  getClient, 
  updateClient, 
  deleteClient 
} from "@/services/clientService";
import { getClientReports, addReport } from "@/services/reportService";
import { getLocalSeoReports } from "@/services/localSeoReportService";
import { Client, ClientReport, SeoLocalReport, ClientDocument } from "@/types/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { generateLocalSeoAnalysis, createLocalSeoReport } from "@/services/localSeoService";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  UserCog, 
  FileText, 
  UploadCloud, 
  MessageSquarePlus, 
  Map, 
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentLocalSeoReport, setCurrentLocalSeoReport] = useState<SeoLocalReport | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const clientData = await getClient(id);
          if (clientData) {
            setClient(clientData);
            const reportData = await getClientReports(id);
            setReports(reportData);
            const localSeoData = await getLocalSeoReports(id);
            setLocalSeoReports(localSeoData);
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar los datos del cliente",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientData();
  }, [id, toast]);

  const handleEditClient = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateClient = async (clientData: Omit<Client, "id" | "createdAt" | "lastReport">) => {
    if (client) {
      try {
        const updatedClient = await updateClient({
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

  const handleDeleteClient = async () => {
    if (client && window.confirm(`¿Estás seguro de eliminar a ${client.name}? Esta acción no se puede deshacer.`)) {
      try {
        await deleteClient(client.id);
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

  const handlePdfAnalysis = async (result: AuditResult) => {
    if (client && id) {
      try {
        // Create a new report from the analysis result
        const currentDate = new Date().toISOString();
        const newReport = await addReport({
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

  const handleClientNotesUpdate = (updatedNotes: string[]) => {
    if (client) {
      const updatedClient: Client = {
        ...client,
        notes: updatedNotes
      };
      setClient(updatedClient);
    }
  };

  const handleGenerateLocalSeoReport = async (documentIds: string[]) => {
    if (client && id) {
      try {
        setIsGeneratingReport(true);
        
        // Mostrar mensaje inicial
        toast({
          title: "Generando informe",
          description: "Analizando documentos y recopilando datos de SEO local...",
        });
        
        // Generar análisis SEO local a partir de los documentos
        const localSeoAnalysis = await generateLocalSeoAnalysis(documentIds, id, client.name);
        
        // Crear informe SEO local a partir del análisis
        const newLocalSeoReport = await createLocalSeoReport(localSeoAnalysis, id, client.name);
        
        // Actualizar la lista de informes locales
        setLocalSeoReports([...localSeoReports, newLocalSeoReport]);
        
        // Establecer el informe actual para mostrarlo
        setCurrentLocalSeoReport(newLocalSeoReport);
        
        // Cambiar a la pestaña de informe local
        setActiveTab("localseo");
        
        toast({
          title: "Informe SEO local creado",
          description: "El informe ha sido generado correctamente a partir de los documentos.",
        });
      } catch (error) {
        console.error("Error al generar informe SEO local:", error);
        toast({
          title: "Error",
          description: "No se pudo generar el informe SEO local. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingReport(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span className="text-lg">Cargando datos del cliente...</span>
      </div>
    );
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
        <TabsList className="mb-4 grid grid-cols-6 max-w-4xl">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Informes
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Facturas
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <UploadCloud className="h-4 w-4" />
            Subir PDF
          </TabsTrigger>
          <TabsTrigger value="localseo" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            SEO Local
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
        
        <TabsContent value="documents">
          <ClientDocuments 
            clientId={client.id}
            notes={client.notes || []}
            onNoteAdded={handleClientNotesUpdate}
            onGenerateReport={handleGenerateLocalSeoReport}
          />
        </TabsContent>
        
        <TabsContent value="reports">
          <ClientReports 
            reports={reports} 
            clientName={client.name}
            onAddReport={handleAddReport}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <ClientInvoicesTab clientId={client.id} clientName={client.name} />
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
        
        <TabsContent value="localseo">
          {isGeneratingReport ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-medium text-green-700 mb-3">Generando informe SEO local...</p>
                <p className="text-gray-500 max-w-md text-center">
                  Estamos analizando los documentos, extrayendo información relevante y consultando datos de posicionamiento local
                </p>
              </CardContent>
            </Card>
          ) : localSeoReports.length > 0 ? (
            <div className="space-y-6">
              {currentLocalSeoReport ? (
                <LocalSeoReportView report={currentLocalSeoReport} />
              ) : (
                <LocalSeoReportView report={localSeoReports[localSeoReports.length - 1]} />
              )}
              
              {localSeoReports.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informes SEO local anteriores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {localSeoReports.slice(0, -1).map((report, index) => (
                        <div key={report.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setCurrentLocalSeoReport(report)}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{report.title}</p>
                              <p className="text-sm text-gray-500">{format(new Date(report.date), "d MMM yyyy", { locale: es })}</p>
                            </div>
                            <Button variant="ghost" size="sm">Ver</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Map className="w-16 h-16 text-green-200 mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">No hay informes SEO local</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Para generar un informe SEO local, sube documentos relacionados con el negocio y haz clic en "Generar Informe"
                </p>
                <Button onClick={() => setActiveTab("documents")} variant="outline" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Ir a Documentos
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
