
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReport, deleteReport, shareReport } from "@/services/reportService";
import { downloadSeoReportPdf } from "@/services/pdf/seoReportPdfService";
import { getClient } from "@/services/clientService";
import { getSharedReportUrl } from "@/services/reportSharingService";
import { Client, ClientReport } from "@/types/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReportDetailHeader,
  ReportDetailContent,
  ReportErrorState,
  ReportLoadingState,
  ReportNotFoundState
} from "@/components/reports";

const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const copyToClipboard = () => {
    if (sharedUrl) {
      navigator.clipboard.writeText(window.location.origin + sharedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportId || !report) return;
    
    try {
      setIsProcessing(true);
      const toastId = toast.loading("Generando PDF del informe...");
      
      const success = await downloadSeoReportPdf(reportId);
      
      toast.dismiss(toastId);
      if (success) {
        toast.success("PDF generado correctamente");
      } else {
        throw new Error("No se pudo generar el PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al generar el PDF del informe");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareReport = async () => {
    if (report) {
      try {
        setIsSharing(true);
        const updatedReport = await shareReport(report.id);
        setReport(updatedReport);
        const shareUrl = await getSharedReportUrl(updatedReport.id);
        setSharedUrl(shareUrl);
        toast.success("Informe compartido correctamente");
      } catch (error) {
        console.error("Error al compartir el informe:", error);
        toast.error("Error al compartir el informe");
      } finally {
        setIsSharing(false);
      }
    }
  };

  const handleDeleteReport = async () => {
    if (reportId) {
      try {
        await deleteReport(reportId);
        toast.success("Informe eliminado correctamente");
        navigate("/reports");
      } catch (error) {
        console.error("Error al eliminar el informe:", error);
        toast.error("Error al eliminar el informe");
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleGoBack = () => {
    if (client && isAdmin) {
      navigate(`/clients/${client.id}`);
    } else if (user && !isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/reports");
    }
  };

  const loadReportData = async () => {
    setIsLoading(true);
    setError(null);
    setIsRetrying(false);
    
    try {
      if (!reportId) {
        setError("ID de informe no proporcionado");
        setIsLoading(false);
        return;
      }
      
      console.log("Loading report with ID:", reportId);
      const reportData = await getReport(reportId);
      
      if (reportData) {
        console.log("Report loaded successfully:", reportData.id, reportData.title);
        setReport(reportData);
        
        if (reportData.clientId) {
          try {
            const clientData = await getClient(reportData.clientId);
            if (clientData) {
              setClient(clientData);
            } else {
              console.warn("Client not found for ID:", reportData.clientId);
            }
          } catch (clientError) {
            console.error("Error fetching client:", clientError);
          }
        }
        
        if (reportData.shareToken) {
          try {
            const shareUrl = await getSharedReportUrl(reportData.id);
            setSharedUrl(shareUrl);
          } catch (shareError) {
            console.error("Error getting share URL:", shareError);
          }
        }
      } else {
        console.error("Report not found with ID:", reportId);
        setError("No se encontró el informe solicitado");
      }
    } catch (error) {
      console.error("Error loading report:", error);
      setError("Error al cargar el informe");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const handleRetry = () => {
    setIsRetrying(true);
    loadReportData();
  };

  if (isLoading) {
    return <ReportLoadingState />;
  }

  if (error) {
    return <ReportErrorState error={error} isRetrying={isRetrying} handleRetry={handleRetry} />;
  }

  if (!report || !client) {
    return <ReportNotFoundState />;
  }

  return (
    <div className="container mx-auto py-8">
      <ReportDetailHeader
        report={report}
        client={client}
        isAdmin={isAdmin}
        sharedUrl={sharedUrl}
        isCopied={isCopied}
        isSharing={isSharing}
        isProcessing={isProcessing}
        handleGoBack={handleGoBack}
        handleShareReport={handleShareReport}
        copyToClipboard={copyToClipboard}
        handleDownloadPdf={handleDownloadPdf}
      />
      
      <ReportDetailContent
        report={report}
        client={client}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteReport={handleDeleteReport}
      />
    </div>
  );
};

export default ReportDetail;
