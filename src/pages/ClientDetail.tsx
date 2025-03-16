
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Client } from "@/types/client";
import { getClient } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProfileTab } from "@/components/client-detail/ClientProfileTab";
import { ClientMetricsTab } from "@/components/client-detail/ClientMetricsTab";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";
import { ClientProposalsList } from "@/components/ClientProposalsList";
import { ClientDocumentsView } from "@/components/client-documents"; // Fixed import
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { LocalSeoTab } from "@/components/client-detail/LocalSeoTab";
import { PdfUploadTab } from "@/components/client-detail/PdfUploadTab";
import { toast } from "sonner";

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!clientId) {
      setError("Client ID is required");
      setIsLoading(false);
      return;
    }

    const fetchClient = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const clientData = await getClient(clientId);
        setClient(clientData);
      } catch (e: any) {
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

  if (isLoading) {
    return <div>Loading client details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
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
          <ClientDocumentsView clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="contract">
          <ClientContractsTab clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="localseo">
          <LocalSeoTab 
            isGeneratingReport={false}
            localSeoReports={[]}
            currentLocalSeoReport={null}
            setCurrentLocalSeoReport={() => {}}
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
