
import { useState } from "react";
import { ClientReport } from "@/types/client";
import { extractSections } from "@/utils/reportFormatting";
import { ReportNavigation } from "@/components/seo-report/ReportNavigation";
import { FormattedReportContent } from "@/components/seo-report/FormattedReportContent";
import { PrintableReportContent } from "@/components/seo-report/PrintableReportContent";
import { AnalyticsReportView } from "@/components/seo-report/AnalyticsReportView";
import { EmptyReportState } from "@/components/seo-report/EmptyReportState";
import { downloadSeoReportPdf } from "@/services/pdf/seoReportPdfOperations";
import { KeywordsAccordion } from "@/components/seo-report/KeywordsAccordion";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  if (!report) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay informe disponible</h3>
        <p className="text-gray-500">Este informe no existe o no está disponible</p>
      </div>
    );
  }

  console.log("Report content in ShareableReportView:", report.content ? report.content.substring(0, 100) + "..." : "No content");

  // Fix: Change the return type to void by not returning the result
  const handleDownloadPdf = async (): Promise<void> => {
    if (report.id) {
      await downloadSeoReportPdf(report.id);
    } else {
      throw new Error("No report ID available");
    }
  };

  if (report.content) {
    const sections = extractSections(report.content);
    const formattedContent = report.content;
    const printContent = report.content;

    return (
      <div className="p-4">
        <ReportNavigation 
          sections={sections} 
          onDownload={handleDownloadPdf}
          reportId={report.id}
        />
        
        <FormattedReportContent report={report} formattedContent={formattedContent} />
        
        {/* Explicitly add KeywordsAccordion here for shared report view */}
        {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
          <div className="mt-8" id="keywords-section">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Palabras Clave Analizadas</h2>
            <KeywordsAccordion report={report} />
          </div>
        )}
        
        <PrintableReportContent report={report} printContent={printContent} />
      </div>
    );
  }

  if (report.analyticsData?.auditResult) {
    return <AnalyticsReportView report={report} />;
  }

  return <EmptyReportState report={report} />;
};
