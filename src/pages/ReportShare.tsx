
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchReportByShareToken } from "@/services/reportSharingService";
import { ClientReport } from "@/types/client";
import { ReportErrorState } from "@/components/reports/ReportErrorState";
import { ReportLoadingState } from "@/components/reports/ReportLoadingState";
import { ReportShareView } from "@/components/ReportShareView";
import { ReportNotFoundState } from "@/components/reports/ReportNotFoundState";

const ReportShare = () => {
  const { token } = useParams<{ token: string }>();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchReport = async () => {
    if (!token) {
      setError("No se proporcionó un token válido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsRetrying(true);
      setError(null);
      
      const reportData = await fetchReportByShareToken(token);
      setReport(reportData);
    } catch (err: any) {
      console.error("Error al cargar el informe compartido:", err);
      setError(err.message || "Error al cargar el informe");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [token]);

  const handleRetry = () => {
    fetchReport();
  };

  if (isLoading) {
    return <ReportLoadingState />;
  }

  if (error) {
    return (
      <ReportErrorState 
        error={error} 
        isRetrying={isRetrying} 
        handleRetry={handleRetry} 
      />
    );
  }

  if (!report) {
    return <ReportNotFoundState />;
  }

  return <ReportShareView report={report} />;
};

export default ReportShare;
