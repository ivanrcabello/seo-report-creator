
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getReportByShareToken } from "@/services/reportSharingService";
import { getClient } from "@/services/clientService";
import { ReportShareView } from "@/components/ReportShareView";

const ReportShare = () => {
  const { token } = useParams<{ token: string }>();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) {
        setError("Enlace de informe no válido");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Obtener informe usando el token compartido
        const reportData = await getReportByShareToken(token);
        
        if (!reportData) {
          setError("El informe no existe o el enlace no es válido");
          return;
        }
        
        // Convertir el formato de la base de datos al formato de la aplicación
        const clientReport: ClientReport = {
          id: reportData.id,
          clientId: reportData.client_id,
          title: reportData.title,
          date: reportData.date,
          type: reportData.type,
          url: reportData.url,
          notes: reportData.notes,
          content: reportData.content || "", // Ensure content is always defined
          documentIds: reportData.document_ids || [],
          shareToken: reportData.share_token,
          sharedAt: reportData.shared_at,
          includeInProposal: reportData.include_in_proposal,
          // Ensure analytics data is always defined
          analyticsData: reportData.analytics_data || {},
          searchConsoleData: reportData.search_console_data,
          auditResult: reportData.audit_result
        };
        
        setReport(clientReport);
        
        // Fetch client data
        if (reportData.client_id) {
          const clientData = await getClient(reportData.client_id);
          setClient(clientData);
        }
        
        console.log("Report loaded successfully:", clientReport);
      } catch (error) {
        console.error("Error fetching report:", error);
        setError("Error al cargar el informe");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-[200px] w-full mb-4 rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudo cargar el informe</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ReportShareView report={report} client={client} />
    </div>
  );
};

export default ReportShare;
