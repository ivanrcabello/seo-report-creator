
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

  const handleSaveClient = (updatedClient: Client) => {
    setClient(updatedClient);
    toast.success("Datos del cliente actualizados correctamente");
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
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("No se pudo cargar la información del cliente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // Fetch proposals for the client
  useEffect(() => {
    if (id) {
      const fetchProposals = async () => {
        try {
          const proposalsData = await getClientProposals(id);
          setProposals(proposalsData);
        } catch (error) {
          console.error("Error fetching proposals:", error);
        }
      };

      fetchProposals();
    }
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/clients">
            <Button>Volver a Clientes</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-yellow-700 mb-4">Cliente no encontrado</h1>
          <p className="text-yellow-600 mb-4">No se encontró información para el cliente solicitado.</p>
          <Link to="/clients">
            <Button>Volver a Clientes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          {client.company && (
            <p className="text-gray-600">{client.company}</p>
          )}
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to={`/clients/edit/${client.id}`}>
            <Button variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Editar Cliente
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ClientProfileTab client={client} onSave={handleSaveClient} />
        </TabsContent>
        
        <TabsContent value="metrics">
          <ClientMetricsTab clientId={client.id} clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="reports">
          <ClientReports clientId={client.id} clientName={client.name} />
        </TabsContent>
        
        <TabsContent value="proposals">
          <ClientProposalsList 
            proposals={proposals} 
            clientId={client.id}
          />
        </TabsContent>
        
        <TabsContent value="contracts">
          <ClientContractsTab 
            clientId={client.id} 
            clientName={client.name} 
          />
        </TabsContent>
        
        <TabsContent value="invoices">
          <ClientInvoicesTab 
            clientId={client.id} 
            clientName={client.name} 
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <PdfUploadTab 
            clientId={client.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
