
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClient } from "@/services/clientService";
import { addReport } from "@/services/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AIReportGenerator } from "@/components/AIReportGenerator";
import { ClientReport } from "@/types/client";

const ReportNew = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        toast.error("ID de cliente no válido");
        navigate("/reports");
        return;
      }
      
      try {
        setIsLoading(true);
        const client = await getClient(clientId);
        if (client) {
          setClientName(client.name);
          setTitle(`Informe SEO - ${client.name}`);
          setUrl(client.website || "");
        } else {
          toast.error("Cliente no encontrado");
          navigate("/reports");
        }
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
        toast.error("No se pudo cargar la información del cliente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    
    try {
      setIsSaving(true);
      const newReport = await addReport({
        clientId: clientId!,
        title,
        url,
        content,
        type: "seo",
        status: "draft",
        date: new Date().toISOString(),
        documentIds: [],
        analyticsData: {},
        searchConsoleData: {},
        auditResult: {}
      });
      
      toast.success("Informe creado correctamente");
      navigate(`/reports/${newReport.id}`);
    } catch (error) {
      console.error("Error al crear el informe:", error);
      toast.error("Error al guardar el informe");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nuevo Informe para {clientName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Informe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Título del informe" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL del sitio web</Label>
                <Input 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://ejemplo.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Contenido del informe" 
                  rows={8} 
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/reports")}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar Informe"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generar con IA</CardTitle>
          </CardHeader>
          <CardContent>
            <AIReportGenerator 
              auditResult={{
                url: url,
                companyName: clientName,
                seoScore: 50,
                performance: 50,
                companyType: "local business",
                location: "Spain",
                webVisibility: "medium",
                keywordsCount: 10,
                domain: url,
                competitors: [],
                technicalIssues: [],
                recommendationsByCategory: {},
                pageSpeed: {
                  desktop: 50,
                  mobile: 50
                }
              }}
              currentReport={null}
              onContentGenerated={setContent}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportNew;
