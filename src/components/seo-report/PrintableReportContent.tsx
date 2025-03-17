
import { ClientReport } from "@/types/client";
import { KeywordsAccordion } from "./KeywordsAccordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PrintableReportContentProps {
  report: ClientReport;
  printContent: string;
}

export const PrintableReportContent = ({ report, printContent }: PrintableReportContentProps) => {
  return (
    <div className="hidden print:block">
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {report.content}
        </ReactMarkdown>
        
        {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
          <KeywordsAccordion report={report} isPrintView={true} />
        )}
      </div>
    </div>
  );
};
