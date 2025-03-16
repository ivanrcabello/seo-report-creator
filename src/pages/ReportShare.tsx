
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getReportByShareToken } from "@/services/reportService";
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
        console.log("Fetching shared report with token:", token);
        // Get report using share token
        const reportData = await getReportByShareToken(token);
        
        if (!reportData) {
          console.error("No report found with token:", token);
          setError("El informe no existe o el enlace no es válido");
          setIsLoading(false);
          return;
        }
        
        console.log("Shared report loaded successfully:", reportData.id, reportData.title);
        setReport(reportData);
        
        // Fetch client data if client ID exists
        if (reportData.clientId) {
          try {
            const clientData = await getClient(reportData.clientId);
            if (clientData) {
              setClient(clientData);
            }
          } catch (clientError) {
            console.error("Error fetching client data:", clientError);
            // We don't set an error here since the report can still be viewed without client data
          }
        }
      } catch (error) {
        console.error("Error fetching shared report:", error);
        setError("Error al cargar el informe");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-600">Cargando informe compartido...</p>
        </div>
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
