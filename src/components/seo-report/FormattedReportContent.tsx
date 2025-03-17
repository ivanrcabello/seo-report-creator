
import { ClientReport } from "@/types/client";
import { KeywordsAccordion } from "./KeywordsAccordion";

interface FormattedReportContentProps {
  report: ClientReport;
  formattedContent: string;
}

export const FormattedReportContent = ({ report, formattedContent }: FormattedReportContentProps) => {
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
      {report.content?.includes("Análisis de Palabras Clave") && (
        <KeywordsAccordion report={report} />
      )}
    </div>
  );
};
