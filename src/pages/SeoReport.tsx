
import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AuditResult } from "@/services/pdfAnalyzer";
import { useToast } from "@/components/ui/use-toast";
import { AIReportGenerator } from "@/components/AIReportGenerator";
import { ReportHeader } from "@/components/seo-report/ReportHeader";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import { NoDataCard } from "@/components/seo-report/NoDataCard";
import { getReport } from "@/services/reportService";
import { ClientReport } from "@/types/client";
import "../styles/print.css";

const SeoReport = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get audit result from location state
    if (location.state?.auditResult) {
      setAuditResult(location.state.auditResult);
    }
    
    // If we have a report ID, fetch the report
    const fetchReport = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const reportData = await getReport(id);
          if (reportData) {
            setReport(reportData);
            
            // If the report has audit results, use those
            if (reportData.auditResult) {
              setAuditResult(reportData.auditResult);
            }
          }
        } catch (error) {
          console.error("Error fetching report:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar el informe",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchReport();
  }, [location, id, toast]);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimiendo informe",
      description: "El informe se está enviando a la impresora",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Descargando informe",
      description: "El informe se descargará en formato PDF",
    });
    alert("Esta funcionalidad requiere una implementación completa de generación de PDF");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seo-blue/5 to-seo-purple/5 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-seo-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-seo-blue">Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return <NoDataCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seo-blue/5 to-seo-purple/5 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <ReportHeader handlePrint={handlePrint} handleDownload={handleDownload} />

        <div ref={reportRef} className="report-container space-y-8 bg-white rounded-xl shadow-lg p-8 print:shadow-none">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-seo-blue mb-2">Informe de Análisis SEO</h1>
            <p className="text-gray-600">Generado el {new Date().toLocaleDateString()}</p>
          </div>

          <ScoreCards auditResult={auditResult} />
          <MetricCards auditResult={auditResult} />
          <SeoDetailsCard auditResult={auditResult} />
          <Recommendations auditResult={auditResult} />
          <AIReportGenerator auditResult={auditResult} currentReport={report} />

          <div className="text-center pt-8 text-sm text-gray-500 print:hidden">
            <p>© {new Date().getFullYear()} SoySeoLocal - Servicio de Análisis SEO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoReport;
