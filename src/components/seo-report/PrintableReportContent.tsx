
import { ClientReport } from "@/types/client";
import { KeywordsAccordion } from "./KeywordsAccordion";

interface PrintableReportContentProps {
  report: ClientReport;
  printContent: string;
}

export const PrintableReportContent = ({ report, printContent }: PrintableReportContentProps) => {
  return (
    <div className="hidden print:block">
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: printContent }} />
        {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
          <KeywordsAccordion report={report} isPrintView={true} />
        )}
      </div>
    </div>
  );
};
