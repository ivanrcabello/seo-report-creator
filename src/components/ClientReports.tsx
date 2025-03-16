
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  PlusCircle,
  BarChart,
  Globe,
  Cog,
  Share,
  AlertCircle 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { getClientReports } from "@/services/reportService";

interface ClientReportsProps {
  reports?: ClientReport[];
  clientId: string;
  clientName: string;
  onAddReport?: () => void;
}

export const ClientReports = ({ reports: propReports, clientId, clientName, onAddReport }: ClientReportsProps) => {
  const [reports, setReports] = useState<ClientReport[]>(propReports || []);
  const [isLoading, setIsLoading] = useState(!propReports);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propReports && clientId) {
      const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
          console.log("Fetching reports for client:", clientId);
          const fetchedReports = await getClientReports(clientId);
          console.log("Fetched reports:", fetchedReports);
          setReports(fetchedReports);
        } catch (error) {
          console.error("Error fetching client reports:", error);
          setError("No se pudieron cargar los informes. Por favor, inténtelo de nuevo más tarde.");
          toast.error("No se pudieron cargar los informes del cliente");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchReports();
    }
  }, [clientId, propReports]);

  const getReportIcon = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'performance':
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case 'technical':
        return <Cog className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Share className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
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
      case 'local-seo':
        return 'SEO Local';
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
      case 'local-seo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: es });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Fecha inválida";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Cargando informes...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Error al cargar informes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mx-auto"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {clientName ? `Informes de ${clientName}` : 'Informes'}
        </CardTitle>
        {onAddReport && (
          <Button onClick={onAddReport} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Informe
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No hay informes disponibles</p>
            {onAddReport && (
              <Button onClick={onAddReport} variant="outline" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Crear Primer Informe
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Informe</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>URL Analizada</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{report.title || 'Sin título'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-normal gap-1 ${getReportTypeColor(report.type)}`}>
                      {getReportIcon(report.type)}
                      {getReportTypeName(report.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">{formatDate(report.date)}</span>
                  </TableCell>
                  <TableCell>
                    {report.url ? (
                      <a 
                        href={report.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1.5 text-sm"
                      >
                        {(() => {
                          try {
                            return new URL(report.url).hostname;
                          } catch (e) {
                            return report.url;
                          }
                        })()}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/reports/${report.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Informe
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
