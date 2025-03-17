
import { ClientReport } from "@/types/client";
import { KeywordsAccordion } from "./KeywordsAccordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedReportContentProps {
  report: ClientReport;
  formattedContent: string;
}

export const FormattedReportContent = ({ report, formattedContent }: FormattedReportContentProps) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {report.content}
      </ReactMarkdown>
      
      {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
        <KeywordsAccordion report={report} />
      )}
    </div>
  );
};
