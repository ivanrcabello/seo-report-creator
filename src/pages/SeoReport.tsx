
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AuditResult } from "@/services/pdfAnalyzer";
import { useToast } from "@/components/ui/use-toast";
import { AIReportGenerator } from "@/components/AIReportGenerator";
import { ReportHeader } from "@/components/seo-report/ReportHeader";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import { NoDataCard } from "@/components/seo-report/NoDataCard";
import "../styles/print.css";

const SeoReport = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.auditResult) {
      setAuditResult(location.state.auditResult);
    }
  }, [location]);

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
          <AIReportGenerator auditResult={auditResult} />

          <div className="text-center pt-8 text-sm text-gray-500 print:hidden">
            <p>© {new Date().getFullYear()} SoySeoLocal - Servicio de Análisis SEO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoReport;
