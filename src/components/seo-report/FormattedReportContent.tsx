
import { ClientReport } from "@/types/client";
import { KeywordsAccordion } from "./KeywordsAccordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedReportContentProps {
  report: ClientReport;
  formattedContent: string;
}

export const FormattedReportContent = ({ report, formattedContent }: FormattedReportContentProps) => {
  // Custom renderer to add IDs to headings for navigation
  const customRenderers = {
    h2: ({node, ...props}) => {
      const id = props.children.toString().toLowerCase().replace(/\s+/g, '-')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Normalize accents
      return <h2 id={id} className="text-2xl font-bold text-blue-600 mt-6 mb-4 scroll-mt-20" {...props} />;
    }
  };

  return (
    <div className="prose max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={customRenderers}
      >
        {report.content}
      </ReactMarkdown>
      
      {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
        <div id="keywords-section" className="mt-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Palabras Clave Analizadas</h2>
          <KeywordsAccordion report={report} />
        </div>
      )}
    </div>
  );
};
