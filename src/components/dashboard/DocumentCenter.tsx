
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, FileCheck, Scroll } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { downloadReportPdf } from "@/services/reportPdfService";
import { downloadProposalPdf } from "@/services/proposalPdfService";
import { v4 as uuidv4 } from "uuid";

interface Document {
  id: string;
  name: string;
  type: 'report' | 'proposal' | 'contract';
  url?: string;
}

export function DocumentCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you'd fetch actual documents from your database
        // For mock data, we need to use proper UUIDs
        const mockDocuments: Document[] = [
          {
            id: uuidv4(), // Using UUID instead of numeric ID
            name: 'Propuesta comercial inicial',
            type: 'proposal',
            url: '#'
          },
          {
            id: uuidv4(), // Using UUID instead of numeric ID
            name: 'Contrato firmado',
            type: 'contract',
            url: '#'
          },
          {
            id: uuidv4(), // Using UUID instead of numeric ID
            name: 'Informe SEO diciembre 2024',
            type: 'report',
            url: '#'
          },
          {
            id: uuidv4(), // Using UUID instead of numeric ID
            name: 'Informe SEO noviembre 2024',
            type: 'report',
            url: '#'
          }
        ];
        
        // Let's persist these mock documents in session storage to maintain IDs between renders
        const storedDocuments = sessionStorage.getItem('mockDocuments');
        if (storedDocuments) {
          setDocuments(JSON.parse(storedDocuments));
        } else {
          setDocuments(mockDocuments);
          sessionStorage.setItem('mockDocuments', JSON.stringify(mockDocuments));
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const filteredDocuments = documents.filter(doc => doc.type === activeTab.slice(0, -1));

  const handleDownload = async (doc: Document) => {
    setDownloadingId(doc.id);
    try {
      console.log(`Starting download for ${doc.type} with ID: ${doc.id}`);
      
      // For demo purposes, we'll simulate successful downloads instead of trying to access non-existent documents
      let success = true;
      
      switch (doc.type) {
        case 'report':
          // In a real app, this would be downloadReportPdf(doc.id)
          // For demo, we'll simulate success without making the API call
          console.log(`Simulating report download for ID: ${doc.id}`);
          // success = await downloadReportPdf(doc.id);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
          break;
        case 'proposal':
          // In a real app, this would be downloadProposalPdf(doc.id)
          // For demo, we'll simulate success without making the API call
          console.log(`Simulating proposal download for ID: ${doc.id}`);
          // success = await downloadProposalPdf(doc.id);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
          break;
        case 'contract':
          // Navigate to contract detail page which has download functionality
          navigate(`/contracts/${doc.id}`);
          return;
      }
      
      if (success) {
        toast({
          title: "Descarga simulada",
          description: `El documento "${doc.name}" se ha descargado (simulación).`,
        });
      } else {
        toast({
          title: "Error al descargar",
          description: "No se pudo descargar el documento. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error downloading ${doc.type}:`, error);
      toast({
        title: "Error al descargar",
        description: "Ocurrió un error al descargar el documento.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (doc: Document) => {
    toast({
      title: "Visualización simulada",
      description: `Visualizando documento: ${doc.name}`,
    });
    
    // In a real app, you would navigate to the actual document
    // For demo purposes, we'll show a toast instead
    /*
    switch (doc.type) {
      case 'report':
        navigate(`/reports/${doc.id}`);
        break;
      case 'proposal':
        navigate(`/proposals/${doc.id}`);
        break;
      case 'contract':
        navigate(`/contracts/${doc.id}`);
        break;
    }
    */
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Centro de documentos
        </CardTitle>
        <CardDescription>
          Consulta y descarga todos tus documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <FileCheck className="h-4 w-4" />
              <span>Informes</span>
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Propuestas</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-1">
              <Scroll className="h-4 w-4" />
              <span>Contratos</span>
            </TabsTrigger>
          </TabsList>
          
          {['reports', 'proposals', 'contracts'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue}>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Cargando documentos...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No hay {tabValue === 'reports' ? 'informes' : 
                        tabValue === 'proposals' ? 'propuestas' : 'contratos'} disponibles
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map(doc => (
                    <div key={doc.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleView(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDownload(doc)}
                          disabled={downloadingId === doc.id}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {downloadingId === doc.id ? 'Descargando...' : 'Descargar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
