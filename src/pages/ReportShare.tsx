import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReport } from "@/services/reportService";
import { ClientReport } from "@/types/client";
import { ShareableReport } from "@/components/ShareableReport";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ReportShare = () => {
  const { reportId, token } = useParams<{ reportId: string; token: string }>();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId || !token) {
        setError("Enlace de informe no válido");
        return;
      }
      
      setIsLoading(true);
      try {
        const reportData = await getReport(reportId);
        
        if (!reportData || reportData.shareToken !== token) {
          setError("El informe no existe o el enlace no es válido");
          return;
        }
        
        setReport(reportData);
      } catch (error) {
        console.error("Error fetching report:", error);
        setError("Error al cargar el informe");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReport();
  }, [reportId, token]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="w-[200px] h-8 mb-4" />
        <Skeleton className="h-[300px] w-full" />
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

  return (
    <div className="container mx-auto p-8">
      {report && <ShareableReport report={report} />}
    </div>
  );
};

export default ReportShare;
