
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, ClientReport, SeoLocalReport } from "@/types/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { getClient, updateClient, deleteClient } from "@/services/clientService";
import { getClientReports, addReport } from "@/services/reportService";
import { getLocalSeoReports } from "@/services/localSeoReportService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, UserCog, FileText, UploadCloud, Map } from "lucide-react";

// Import refactored components
import { ClientHeader } from "@/components/client-detail/ClientHeader";
import { ClientForm } from "@/components/ClientForm";
import { ClientProfileTab } from "@/components/client-detail/ClientProfileTab";
import { PdfUploadTab } from "@/components/client-detail/PdfUploadTab";
import { LocalSeoTab } from "@/components/client-detail/LocalSeoTab";
import ClientDocuments from "@/components/ClientDocuments";
import { ClientProposalsList } from "@/components/ClientProposalsList";
import { generateLocalSeoAnalysis, createLocalSeoReport } from "@/services/localSeoService";

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

  const handlePdfAnalysis = async (result: AuditResult) => {
    if (client && id) {
      try {
        const currentDate = new Date().toISOString();
        const newReport = await addReport({
          title: `Auditoría SEO - ${format(new Date(), "d MMM yyyy", { locale: es })}`,
          type: "seo", 
          date: currentDate,
          clientId: id,
          notes: `Informe generado automáticamente a partir de un PDF el ${format(new Date(), "d MMMM yyyy", { locale: es })}`,
        });
        
        setReports([...reports, newReport]);
        
        toast({
          title: "Informe creado",
          description: "Informe generado correctamente desde el PDF.",
        });
        
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
        
        toast({
          title: "Generando informe",
          description: "Analizando documentos y recopilando datos de SEO local...",
        });
        
        const localSeoAnalysis = await generateLocalSeoAnalysis(documentIds, id, client.name);
        
        const newLocalSeoReport = await createLocalSeoReport(localSeoAnalysis, id, client.name);
        
        setLocalSeoReports([...localSeoReports, newLocalSeoReport]);
        
        setCurrentLocalSeoReport(newLocalSeoReport);
        
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
        <p className="text-center text-gray-500">Cliente no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {isEditing ? (
        <div className="mb-8">
          <ClientForm 
            client={client}
            onSubmit={handleUpdateClient}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <ClientHeader 
          client={client} 
          onEdit={handleEditClient} 
          onDelete={handleDeleteClient} 
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-4 grid grid-cols-5 max-w-4xl">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="proposals-list" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Propuestas e Informes
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
          <ClientProfileTab client={client} />
        </TabsContent>
        
        <TabsContent value="documents">
          <ClientDocuments 
            clientId={client.id}
            notes={client.notes || []}
            onNoteAdded={handleClientNotesUpdate}
            onGenerateReport={handleGenerateLocalSeoReport}
          />
        </TabsContent>
        
        <TabsContent value="proposals-list">
          <ClientProposalsList clientId={client.id} />
        </TabsContent>
        
        <TabsContent value="upload">
          <PdfUploadTab 
            clientName={client.name}
            onAnalysisComplete={handlePdfAnalysis}
          />
        </TabsContent>
        
        <TabsContent value="localseo">
          <LocalSeoTab 
            isGeneratingReport={isGeneratingReport}
            localSeoReports={localSeoReports}
            currentLocalSeoReport={currentLocalSeoReport}
            setCurrentLocalSeoReport={setCurrentLocalSeoReport}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
