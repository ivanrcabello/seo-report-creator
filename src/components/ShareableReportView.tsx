
import { useState } from "react";
import { ClientReport } from "@/types/client";
import { extractSections } from "@/utils/reportFormatting";
import { ReportNavigation } from "@/components/seo-report/ReportNavigation";
import { FormattedReportContent } from "@/components/seo-report/FormattedReportContent";
import { PrintableReportContent } from "@/components/seo-report/PrintableReportContent";
import { AnalyticsReportView } from "@/components/seo-report/AnalyticsReportView";
import { EmptyReportState } from "@/components/seo-report/EmptyReportState";
import { downloadSeoReportPdf } from "@/services/pdf/seoReportPdfOperations";

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

  const handleDownloadPdf = async () => {
    if (report.id) {
      return downloadSeoReportPdf(report.id);
    }
    return Promise.reject("No report ID available");
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
        
        <PrintableReportContent report={report} printContent={printContent} />
      </div>
    );
  }

  if (report.analyticsData?.auditResult) {
    return <AnalyticsReportView report={report} />;
  }

  return <EmptyReportState report={report} />;
};
