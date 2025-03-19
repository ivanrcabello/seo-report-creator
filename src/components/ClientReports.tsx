import { useState, useEffect } from "react";
import { ClientReport } from "@/types/client";
import { getAllReports, getClientReports } from "@/services/reportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth";

interface ClientReportsProps {
  clientId: string;
  clientName?: string;
}

export function ClientReports({ clientId, clientName }: ClientReportsProps) {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        let data: ClientReport[] = [];
        
        // Only fetch reports for the specific client
        data = await getClientReports(clientId);
        
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchReports();
    }
  }, [clientId, isAdmin]);

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {clientName ? `Informes de ${clientName}` : 'Informes'}
        </CardTitle>
        {isAdmin && (
          <Button onClick={() => navigate(`/reports/new/${clientId}`)} className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Informe
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No hay informes disponibles</p>
            {isAdmin && (
              <Button onClick={() => navigate(`/reports/new/${clientId}`)} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Crear Primer Informe
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-md overflow-hidden">
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">{report.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(report.date), "d MMMM yyyy", { locale: es })}</span>
                      {report.type && (
                        <Badge variant="outline" className="ml-2">{report.type}</Badge>
                      )}
                      <Badge 
                        className={
                          report.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          report.status === 'published' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {report.status === 'draft' ? 'Borrador' : 
                         report.status === 'published' ? 'Publicado' : 
                         'Compartido'}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleViewReport(report.id)} 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver Informe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
