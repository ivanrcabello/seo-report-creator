
import { ClientReport } from "@/types/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  // If the report has content, render it using ReactMarkdown
  if (report.content) {
    return (
      <div className="prose prose-blue max-w-none prose-headings:text-seo-blue prose-a:text-seo-purple">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {report.content}
        </ReactMarkdown>
      </div>
    );
  }

  // If no content, display a simple message
  return (
    <div className="text-center py-8 text-gray-500">
      Este informe no contiene contenido formateado.
    </div>
  );
};
