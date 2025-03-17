
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, FileCheck, Scroll } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: 'report' | 'proposal' | 'contract';
  url?: string;
}

export function DocumentCenter() {
  const { user } = useAuth();
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
        
        // Fetch actual documents from database for the current user
        const reportsPromise = supabase
          .from('client_reports')
          .select('id, title, date, status')
          .eq('client_id', user.id)
          .order('date', { ascending: false });
        
        const contractsPromise = supabase
          .from('seo_contracts')
          .select('id, title, created_at, status')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
          
        // Add more document types as needed
        
        const [reportsResult, contractsResult] = await Promise.all([
          reportsPromise,
          contractsPromise
        ]);
        
        if (reportsResult.error) {
          console.error("Error fetching reports:", reportsResult.error);
          toast.error("Error al cargar los informes");
        }
        
        if (contractsResult.error) {
          console.error("Error fetching contracts:", contractsResult.error);
          toast.error("Error al cargar los contratos");
        }
        
        const clientDocuments: Document[] = [
          ...(reportsResult.data || []).map(report => ({
            id: report.id,
            name: report.title || `Informe ${new Date(report.date).toLocaleDateString('es-ES')}`,
            type: 'report' as const
          })),
          ...(contractsResult.data || []).map(contract => ({
            id: contract.id,
            name: contract.title || `Contrato ${new Date(contract.created_at).toLocaleDateString('es-ES')}`,
            type: 'contract' as const
          }))
        ];
        
        setDocuments(clientDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Error al cargar los documentos");
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
      if (doc.type === 'report') {
        window.open(`/reports/${doc.id}?download=true`, '_blank');
      } else if (doc.type === 'contract') {
        window.open(`/contracts/${doc.id}?download=true`, '_blank');
      } else if (doc.type === 'proposal') {
        window.open(`/proposals/${doc.id}?download=true`, '_blank');
      }
    } catch (error) {
      console.error(`Error downloading ${doc.type}:`, error);
      toast.error(`Error al descargar el ${doc.type === 'report' ? 'informe' : doc.type === 'contract' ? 'contrato' : 'propuesta'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (doc: Document) => {
    if (doc.type === 'report') {
      navigate(`/reports/${doc.id}`);
    } else if (doc.type === 'contract') {
      navigate(`/contracts/${doc.id}`);
    } else if (doc.type === 'proposal') {
      navigate(`/proposals/${doc.id}`);
    }
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
