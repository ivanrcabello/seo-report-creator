
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClientHeader } from "@/components/client-detail/ClientHeader";
import { ClientProfileTab } from "@/components/client-detail/ClientProfileTab";
import ClientDocuments from "@/components/ClientDocuments";
import { PdfUploadTab } from "@/components/client-detail/PdfUploadTab";
import { ClientMetricsTab } from "@/components/client-detail/ClientMetricsTab";
import { getClient } from "@/services/clientService";
import { getSeoLocalReports } from "@/services/localSeoReportService";
import { useToast } from "@/hooks/use-toast";
import { Client, ClientReport, SeoLocalReport } from "@/types/client";
import { ClientReports } from "@/components/ClientReports";
import { ClientProposalsList } from "@/components/ClientProposalsList";
import { ClientInvoices } from "@/components/ClientInvoices";
import { LocalSeoTab } from "@/components/client-detail/LocalSeoTab";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ArrowLeft } from "lucide-react";
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!id) {
      console.error("Client ID is missing.");
      return;
    }

    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClient(id);
        if (clientData) {
          setClient(clientData);
        } else {
          toast({
            title: "Error",
            description: "Client not found.",
            variant: "destructive",
          });
          navigate("/clients");
        }
      } catch (error) {
        console.error("Failed to fetch client:", error);
        toast({
          title: "Error",
          description: "Failed to fetch client data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id, navigate, toast]);

  useEffect(() => {
    const fetchReports = async () => {
      if (id) {
        try {
          const reportsData = await getSeoLocalReports(id);
          setLocalSeoReports(reportsData);
        } catch (error) {
          console.error("Failed to fetch reports:", error);
          toast({
            title: "Error",
            description: "Failed to fetch reports.",
            variant: "destructive",
          });
        }
      }
    };

    fetchReports();
  }, [id, toast]);

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleGenerateReport = async () => {
    if (!client) {
      toast({
        title: "Error",
        description: "Client data not loaded.",
        variant: "destructive",
      });
      return;
    }

    if (selectedDocuments.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one document to generate the report.",
      });
      return;
    }

    try {
      // We will implement these functions in the next step
      const analysis = await generateLocalSeoAnalysis(selectedDocuments, client.id, client.name);
      const newReport = await createLocalSeoReport(analysis, client.id, client.name);

      // Add the new report to state
      setLocalSeoReports((prevReports) => [...prevReports, newReport]);
      
      toast({
        title: "Success",
        description: "Local SEO report generated successfully!",
      });
    } catch (error) {
      console.error("Error generating local SEO report:", error);
      toast({
        title: "Error",
        description: "Failed to generate local SEO report.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  // Mock functions for ClientHeader requirements
  const handleEdit = () => navigate(`/clients/edit/${client.id}`);
  const handleDelete = () => console.log("Delete client:", client.id);
  const handleToggleActive = (isActive: boolean) => console.log("Toggle active:", isActive);

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate("/clients")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Clientes
      </Button>
      <ClientHeader 
        client={client} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
      <Tabs defaultValue="profile" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          {isAdmin && <TabsTrigger value="local-seo">SEO Local</TabsTrigger>}
        </TabsList>
        <TabsContent value="profile">
          <ClientProfileTab client={client} />
        </TabsContent>
        <TabsContent value="documents">
          <ClientDocuments
            clientId={client.id}
            notes={client.notes}
            onGenerateReport={handleGenerateReport}
          />
          {isAdmin && (
            <div className="mt-4">
              <Button onClick={handleGenerateReport} disabled={selectedDocuments.length === 0}>
                Generar Informe SEO Local
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="metrics">
          <ClientMetricsTab clientId={client.id} clientName={client.name} />
        </TabsContent>
        <TabsContent value="reports">
          <ClientReports reports={reports} />
          {isAdmin && (
            <Button asChild>
              <a href={`/reports/new/${client.id}`} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Informe
              </a>
            </Button>
          )}
        </TabsContent>
        <TabsContent value="proposals">
          <ClientProposalsList clientId={client.id} />
          {isAdmin && (
            <Button asChild>
              <a href={`/proposals/new/${client.id}`} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Propuesta
              </a>
            </Button>
          )}
        </TabsContent>
        <TabsContent value="invoices">
          <ClientInvoices clientId={client.id} invoices={[]} />
          {isAdmin && (
            <Button asChild>
              <a href={`/invoices/new?clientId=${client.id}`} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Factura
              </a>
            </Button>
          )}
        </TabsContent>
        <TabsContent value="contracts">
          <ClientContractsTab clientId={client.id} />
          {isAdmin && (
            <Button asChild>
              <a href={`/contracts/new/${client.id}`} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Contrato
              </a>
            </Button>
          )}
        </TabsContent>
        {isAdmin && (
          <TabsContent value="local-seo">
            <LocalSeoTab 
              isGeneratingReport={false}
              localSeoReports={localSeoReports}
              currentLocalSeoReport={localSeoReports.length > 0 ? localSeoReports[0] : null}
              setCurrentLocalSeoReport={(report) => console.log("Setting current report:", report)}
              setActiveTab={(tab) => console.log("Setting active tab:", tab)}
            />
            <PdfUploadTab 
              clientName={client.name}
              onAnalysisComplete={(result) => console.log("Analysis result:", result)}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Helper functions to generate SEO reports
async function generateLocalSeoAnalysis(documentIds: string[], clientId: string, clientName: string): Promise<Omit<SeoLocalReport, "id">> {
  console.log("Generating local SEO analysis for documents:", documentIds);
  
  // This function analyzes documents and generates SEO data
  // For now, we'll use a placeholder
  
  const sampleAnalysis: Omit<SeoLocalReport, "id"> = {
    clientId: clientId,
    title: `Informe SEO Local - ${clientName}`,
    date: new Date().toISOString(),
    businessName: clientName,
    address: "Calle Principal 123",
    location: "Madrid, España",
    phone: "+34 91 123 45 67",
    website: "www.example.com",
    googleBusinessUrl: "https://business.google.com/example",
    googleMapsRanking: 4,
    googleReviewsCount: 12,
    keywordRankings: [
      { keyword: "negocio local madrid", position: 15 },
      { keyword: "servicios profesionales madrid", position: 22 },
      { keyword: `${clientName.toLowerCase()} madrid`, position: 8 }
    ],
    localListings: [
      { platform: "Google Business", status: "Verificado" },
      { platform: "Yelp", status: "Listado" },
      { platform: "TripAdvisor", status: "No listado" }
    ],
    recommendations: [
      "Optimizar perfil de Google Business",
      "Conseguir más reseñas de clientes",
      "Mejorar presencia en directorios locales",
      "Crear contenido orientado a palabras clave locales"
    ]
  };
  
  console.log("Generated sample analysis:", sampleAnalysis);
  
  return sampleAnalysis;
}

async function createLocalSeoReport(
  analysis: Omit<SeoLocalReport, "id">, 
  clientId: string, 
  clientName: string
): Promise<SeoLocalReport> {
  console.log("Creating local SEO report for client:", clientId, clientName);
  
  try {
    // Import the createSeoLocalReport function from localSeoReportService
    const { createSeoLocalReport } = await import("@/services/localSeoReportService");
    
    // Create the report
    const id = await createSeoLocalReport(analysis);
    
    console.log("Created local SEO report with ID:", id);
    
    return {
      ...analysis,
      id
    };
  } catch (error) {
    console.error("Error creating local SEO report:", error);
    throw error;
  }
}
