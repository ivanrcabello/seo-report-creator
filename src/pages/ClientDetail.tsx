
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
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { PdfUploadTab } from "@/components/client-detail/PdfUploadTab";
import { LocalSeoTab } from "@/components/client-detail/LocalSeoTab";
import { toast } from "sonner";
import { getLocalSeoReports } from "@/services/localSeoService";

export default function ClientDetail() {
  // Extract the client ID from the URL parameter
  const { clientId } = useParams<{ clientId: string }>();
  const id = clientId || "";
  
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Local SEO states
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentLocalSeoReport, setCurrentLocalSeoReport] = useState<SeoLocalReport | null>(null);
  const [isGeneratingLocalSeoReport, setIsGeneratingLocalSeoReport] = useState(false);
  
  console.log("ClientDetail component loaded with id from useParams:", clientId);
  console.log("Using clientId:", id);

  useEffect(() => {
    if (!id) {
      console.error("Client ID is missing from URL params");
      setError("Client ID is required");
      setIsLoading(false);
      return;
    }

    const fetchClient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching client data for ID:", id);
        const clientData = await getClient(id);
        console.log("Client data received:", clientData);
        setClient(clientData);
      } catch (e: any) {
        console.error("Error fetching client:", e);
        setError(e.message || "Failed to fetch client");
        toast.error("Failed to fetch client");
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchLocalSeoReports = async () => {
      try {
        const reports = await getLocalSeoReports(id);
        setLocalSeoReports(reports);
        if (reports.length > 0) {
          setCurrentLocalSeoReport(reports[0]);
        }
      } catch (e) {
        console.error("Error fetching local SEO reports:", e);
      }
    };

    fetchClient();
    fetchLocalSeoReports();
  }, [id]);

  const handleUpdateClient = (updatedClient: Client) => {
    setClient(updatedClient);
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
            <Link to={`/clients/edit/${id}`} className="flex items-center gap-2">
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
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="report">Informe</TabsTrigger>
          <TabsTrigger value="local-seo">SEO Local</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ClientProfileTab client={client} onSave={handleUpdateClient} />
        </TabsContent>
        
        <TabsContent value="metrics">
          <ClientMetricsTab clientId={id} clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <ClientInvoicesTab clientId={id} clientName={client?.name || ""} />
        </TabsContent>
        
        <TabsContent value="proposals">
          <ClientProposalsList 
            clientId={id} 
            proposals={[]} 
          />
        </TabsContent>
        
        <TabsContent value="contract">
          <ClientContractsTab clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="report">
          <PdfUploadTab clientName={client.name} onAnalysisComplete={() => {}} />
        </TabsContent>
        
        <TabsContent value="local-seo">
          <LocalSeoTab 
            isGeneratingReport={isGeneratingLocalSeoReport} 
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
