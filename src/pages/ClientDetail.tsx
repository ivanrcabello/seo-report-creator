
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Client, SeoLocalReport } from "@/types/client";
import { getClient } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProfileTab } from "@/components/client-detail/ClientProfileTab";
import { ClientMetricsTab } from "@/components/client-detail/ClientMetricsTab";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";
import { ClientProposalsList } from "@/components/ClientProposalsList";
import { ClientDocuments } from "@/components/client-documents";
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { LocalSeoTab } from "@/components/client-detail/LocalSeoTab";
import { PdfUploadTab } from "@/components/client-detail/PdfUploadTab";
import { toast } from "sonner";

export default function ClientDetail() {
  // Check how the route is defined in App.tsx - it uses :id as parameter
  const { id } = useParams<{ id: string }>();
  const clientId = id || "";
  
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentLocalSeoReport, setCurrentLocalSeoReport] = useState<SeoLocalReport | null>(null);
  
  console.log("ClientDetail component loaded with id from useParams:", id);
  console.log("Using clientId:", clientId);

  useEffect(() => {
    if (!clientId) {
      console.error("Client ID is missing from URL params");
      setError("Client ID is required");
      setIsLoading(false);
      return;
    }

    const fetchClient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching client data for ID:", clientId);
        const clientData = await getClient(clientId);
        console.log("Client data received:", clientData);
        setClient(clientData);
        
        // Fetch local SEO reports
        try {
          const { getLocalSeoReports } = await import("@/services/localSeoService");
          const reports = await getLocalSeoReports(clientId);
          setLocalSeoReports(reports);
          if (reports.length > 0) {
            setCurrentLocalSeoReport(reports[0]);
          }
        } catch (e) {
          console.error("Error fetching local SEO reports:", e);
          // Don't block the UI for this secondary data
        }
      } catch (e: any) {
        console.error("Error fetching client:", e);
        setError(e.message || "Failed to fetch client");
        toast.error("Failed to fetch client");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleUpdateClient = (updatedClient: Client) => {
    setClient(updatedClient);
  };

  const handleGenerateLocalSeoReport = async (documentIds: string[]) => {
    if (!client) return;
    
    setIsGeneratingReport(true);
    setActiveTab("localseo");
    
    try {
      const { generateLocalSeoAnalysis, createLocalSeoReport } = await import("@/services/localSeoService");
      
      // Generate analysis from documents
      const analysis = await generateLocalSeoAnalysis(documentIds, clientId, client.name);
      
      // Create report in the database
      const report = await createLocalSeoReport(analysis, clientId, client.name);
      
      // Update local state
      setLocalSeoReports(prev => [report, ...prev]);
      setCurrentLocalSeoReport(report);
      
      toast.success("Informe SEO local generado exitosamente");
    } catch (error) {
      console.error("Error generating local SEO report:", error);
      toast.error("Error al generar el informe SEO local");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-6">Loading client details...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-500">Error: {error}</div>;
  }

  if (!client) {
    return <div className="container mx-auto py-6">Client not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-gray-500">Detalles y gestión del cliente</p>
        </div>
        <div>
          <Button asChild variant="outline">
            <Link to={`/clients/edit/${clientId}`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Editar Cliente
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="localseo">SEO Local</TabsTrigger>
          <TabsTrigger value="report">Informe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ClientProfileTab client={client} onSave={handleUpdateClient} />
        </TabsContent>
        
        <TabsContent value="metrics">
          <ClientMetricsTab clientId={clientId} clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <ClientInvoicesTab clientId={clientId} clientName={client?.name || ""} />
        </TabsContent>
        
        <TabsContent value="proposals">
          <ClientProposalsList 
            clientId={clientId} 
            proposals={[]} 
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <ClientDocuments 
            clientId={clientId} 
            onGenerateReport={handleGenerateLocalSeoReport}
          />
        </TabsContent>
        
        <TabsContent value="contract">
          <ClientContractsTab clientName={client.name} />
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
        
        <TabsContent value="report">
          <PdfUploadTab clientName={client.name} onAnalysisComplete={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
