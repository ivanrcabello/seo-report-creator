
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getReport } from "@/services/clientService";
import { verifyReportShareToken } from "@/services/reportSharingService";
import { ClientReport } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareableReport } from "@/components/ShareableReport";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Calendar, Globe, ExternalLink, AlertTriangle } from "lucide-react";

const ReportShare = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      if (!id || !token) {
        setError("Enlace de informe no válido");
        setIsLoading(false);
        return;
      }

      try {
        // Verificar si el token es válido
        const tokenValid = await verifyReportShareToken(id, token);
        
        if (!tokenValid) {
          setError("El enlace del informe ha expirado o no es válido");
          setIsLoading(false);
          return;
        }

        // Cargar el informe
        const foundReport = getReport(id);
        if (!foundReport) {
          setError("Informe no encontrado");
          setIsLoading(false);
          return;
        }

        // Verificar si el token coincide con el del informe
        if (foundReport.shareToken !== token) {
          setError("Token de acceso no válido");
          setIsLoading(false);
          return;
        }

        setReport(foundReport);
        setIsValid(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar el informe compartido:", error);
        setError("Error al cargar el informe");
        setIsLoading(false);
      }
    };

    loadReport();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !isValid || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Error al acceder al informe</CardTitle>
            <CardDescription className="text-center">
              {error || "No se puede acceder a este informe"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/">Volver al inicio</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{report.title}</CardTitle>
                <CardDescription className="mt-2">
                  Informe creado el {format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es })}
                </CardDescription>
              </div>
              
              <Badge variant="outline" className="font-normal">
                {report.type === 'seo' ? 'Informe SEO' : 
                 report.type === 'performance' ? 'Rendimiento' : 
                 report.type === 'technical' ? 'Técnico' : 
                 report.type === 'social' ? 'Social' : 
                 report.type}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {report.url && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <a 
                  href={report.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {report.url}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            
            <Separator />
            
            <ShareableReport report={report} />
            
            {report.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Notas adicionales</h3>
                  <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Servicio de Análisis SEO | Este informe es confidencial
        </div>
      </div>
    </div>
  );
};

export default ReportShare;
