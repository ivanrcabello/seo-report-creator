
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  getReport, 
  getClient, 
  deleteReport,
  updateReport 
} from "@/services/clientService";
import { ClientReport } from "@/types/client";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText, 
  Globe, 
  User,
  ExternalLink,
  BarChart,
  Cog,
  Share,
  Link2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { shareReport, generatePublicReportUrl } from "@/services/reportSharingService";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [clientName, setClientName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundReport = getReport(id);
      if (foundReport) {
        setReport(foundReport);
        
        const client = getClient(foundReport.clientId);
        if (client) {
          setClientName(client.name);
        }
        
        // Si el informe ya tiene un token de compartir, generamos la URL
        if (foundReport.shareToken) {
          setShareUrl(generatePublicReportUrl(foundReport.id, foundReport.shareToken));
        }
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleDeleteReport = () => {
    if (report && window.confirm(`¿Estás seguro de eliminar este informe? Esta acción no se puede deshacer.`)) {
      try {
        deleteReport(report.id);
        toast({
          title: "Informe eliminado",
          description: `El informe ha sido eliminado correctamente.`,
        });
        navigate(`/clients/${report.clientId}`);
      } catch (error) {
        console.error("Error al eliminar informe:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el informe. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShareReport = async () => {
    if (!report) return;
    
    setIsSharing(true);
    try {
      const updatedReport = await shareReport(report);
      updateReport(updatedReport);
      setReport(updatedReport);
      
      const url = generatePublicReportUrl(updatedReport.id, updatedReport.shareToken!);
      setShareUrl(url);
      
      // Copiar al portapapeles
      await navigator.clipboard.writeText(url);
      
      toast({
        title: "Informe compartido",
        description: "Enlace copiado al portapapeles.",
      });
    } catch (error) {
      console.error("Error al compartir informe:", error);
      toast({
        title: "Error",
        description: "No se pudo compartir el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Enlace copiado",
        description: "Enlace copiado al portapapeles.",
      });
    } catch (error) {
      console.error("Error al copiar enlace:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getReportIcon = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return <Globe className="h-5 w-5 text-green-600" />;
      case 'performance':
        return <BarChart className="h-5 w-5 text-purple-600" />;
      case 'technical':
        return <Cog className="h-5 w-5 text-blue-600" />;
      case 'social':
        return <Share className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getReportTypeName = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return 'SEO';
      case 'performance':
        return 'Rendimiento';
      case 'technical':
        return 'Técnico';
      case 'social':
        return 'Social';
      default:
        return type;
    }
  };

  const getReportTypeColor = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'social':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  if (!report) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <p className="text-gray-500 mb-4">Informe no encontrado</p>
            <Link to="/clients">
              <Button variant="outline">Volver a Clientes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link to={`/clients/${report.clientId}`} className="mr-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Detalle del Informe</h1>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getReportIcon(report.type)}
              <CardTitle className="text-2xl">{report.title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`font-normal gap-1 ${getReportTypeColor(report.type)}`}>
                    {getReportTypeName(report.type)}
                  </Badge>
                  
                  {report.shareToken && (
                    <Badge variant="outline" className="font-normal gap-1 bg-blue-100 text-blue-800 border-blue-200">
                      <Link2 className="h-4 w-4" />
                      Compartido
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Creado el {format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <Link to={`/clients/${report.clientId}`} className="text-blue-600 hover:underline">
                    {clientName}
                  </Link>
                </div>
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
              </div>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {shareUrl ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyShareLink}
                className="flex items-center gap-1"
              >
                <Share className="h-4 w-4" />
                Copiar enlace
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShareReport}
                disabled={isSharing}
                className="flex items-center gap-1"
              >
                <Share className="h-4 w-4" />
                {isSharing ? "Compartiendo..." : "Compartir"}
              </Button>
            )}
            <Link to={`/reports/edit/${report.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteReport} 
              className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </CardHeader>
        
        {report.notes && (
          <CardContent>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium mb-2">Notas</h3>
              <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
            </div>
          </CardContent>
        )}
        
        {shareUrl && (
          <CardContent>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Share className="h-5 w-5 text-blue-500" />
                Enlace para compartir
              </h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-600"
                />
                <Button size="sm" variant="outline" onClick={copyShareLink}>
                  Copiar
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cualquier persona con este enlace podrá ver este informe sin necesidad de iniciar sesión.
              </p>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/clients/${report.clientId}`)}>
            Volver al Cliente
          </Button>
          <Link to="/report">
            <Button>
              Ver Panel de Informes SEO
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportDetail;
