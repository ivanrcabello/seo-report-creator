
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, FileCheck, FileContract } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  name: string;
  type: 'report' | 'proposal' | 'contract';
  url?: string;
}

export function DocumentCenter() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    if (!user) return;

    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you'd fetch actual documents from your database
        // This is just mock data
        const mockDocuments: Document[] = [
          {
            id: '1',
            name: 'Propuesta comercial inicial',
            type: 'proposal',
            url: '#'
          },
          {
            id: '2',
            name: 'Contrato firmado',
            type: 'contract',
            url: '#'
          },
          {
            id: '3',
            name: 'Informe SEO diciembre 2024',
            type: 'report',
            url: '#'
          },
          {
            id: '4', 
            name: 'Informe SEO noviembre 2024',
            type: 'report',
            url: '#'
          }
        ];
        
        setDocuments(mockDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const filteredDocuments = documents.filter(doc => doc.type === activeTab.slice(0, -1));

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
              <FileContract className="h-4 w-4" />
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
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
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
