
import { useState } from "react";
import { PdfUploader } from "@/components/PdfUploader";
import { DashboardSummary } from "@/components/DashboardSummary";
import { AuditResult } from "@/services/pdfAnalyzer";

const Index = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | undefined>(undefined);

  const handleAnalysisComplete = (result: AuditResult) => {
    setAuditResult(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900">
              Análisis de Posicionamiento Web
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sube tu informe de auditoría en PDF y obtén un análisis detallado del posicionamiento web de tu empresa
            </p>
          </div>

          <div className="grid gap-8">
            <PdfUploader onAnalysisComplete={handleAnalysisComplete} />
            <DashboardSummary auditResult={auditResult} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
