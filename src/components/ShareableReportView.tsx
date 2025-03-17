
import { useState } from "react";
import { ClientReport } from "@/types/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatReportContent, extractSections } from "@/utils/reportFormatting";
import { ReportNavigation } from "@/components/seo-report/ReportNavigation";
import { FormattedReportContent } from "@/components/seo-report/FormattedReportContent";
import { PrintableReportContent } from "@/components/seo-report/PrintableReportContent";
import { AnalyticsReportView } from "@/components/seo-report/AnalyticsReportView";
import { EmptyReportState } from "@/components/seo-report/EmptyReportState";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  const [viewTab, setViewTab] = useState("formatted");

  if (!report) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay informe disponible</h3>
        <p className="text-gray-500">Este informe no existe o no está disponible</p>
      </div>
    );
  }

  console.log("Report content in ShareableReportView:", report.content ? report.content.substring(0, 100) + "..." : "No content");

  if (report.content) {
    const sections = extractSections(report.content);
    const formattedContent = formatReportContent(report.content);
    const printContent = formatReportContent(report.content, true);

    return (
      <div className="p-4">
        <ReportNavigation sections={sections} />
        
        <Tabs defaultValue={viewTab} onValueChange={setViewTab} className="w-full print:hidden">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="formatted" className="flex-1">Vista Formateada</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formatted" className="mt-2">
            <FormattedReportContent report={report} formattedContent={formattedContent} />
          </TabsContent>
          
          <TabsContent value="markdown" className="mt-2">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-auto">
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report.content}
                </ReactMarkdown>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <PrintableReportContent report={report} printContent={printContent} />
      </div>
    );
  }

  if (report.analyticsData?.auditResult) {
    return <AnalyticsReportView report={report} />;
  }

  return <EmptyReportState report={report} />;
};
