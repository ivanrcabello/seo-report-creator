
import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Client, SeoLocalReport, Proposal } from "@/types/client";
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
import { toast } from "sonner";
import { getLocalSeoReports } from "@/services/localSeoService";
import { ClientReports } from "@/components/ClientReports";
import { getClientProposals } from "@/services/proposalService";

export default function ClientDetail() {
  // Extract the client ID from the URL parameter
  const { clientId } = useParams<{ clientId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = clientId || "";
  
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "profile";
  });
  
  // Local SEO states - kept for future references but not used in the main tabs anymore
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentLocalSeoReport, setCurrentLocalSeoReport] = useState<SeoLocalReport | null>(null);
  
  // Proposals state
  const [proposals, setProposals] = useState<Proposal[]>([]);
  
  console.log("ClientDetail component loaded with id from useParams:", clientId);
  console.log("Using clientId:", id);

  // Effect to handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update the URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set("tab", value);
    setSearchParams(searchParams);
  };

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
    
    const fetchProposals = async () => {
      try {
        const clientProposals = await getClientProposals(id);
        setProposals(clientProposals);
      } catch (e) {
        console.error("Error fetching client proposals:", e);
      }
    };

    fetchClient();
    fetchLocalSeoReports();
    fetchProposals();
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
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
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
            proposals={proposals} 
          />
        </TabsContent>
        
        <TabsContent value="contract">
          <ClientContractsTab clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="reports">
          <ClientReports clientId={id} clientName={client.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
