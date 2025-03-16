
import { ClientReport } from "@/types/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  // Check if the report has analytics data or audit results to display
  const hasVisualData = report.analyticsData || report.auditResult;
  
  return (
    <div className="space-y-6">
      {/* Visual indicators section - only show if we have data */}
      {hasVisualData && (
        <div className="bg-gradient-to-r from-white to-gray-50 border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-seo-blue">Indicadores de Rendimiento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Score */}
            {report.auditResult?.seoScore !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Puntuación SEO</span>
                  <span className={`font-bold ${getScoreColorClass(report.auditResult.seoScore)}`}>
                    {report.auditResult.seoScore}%
                  </span>
                </div>
                <Progress 
                  value={report.auditResult.seoScore} 
                  className="h-2"
                  indicatorClassName={getProgressColorClass(report.auditResult.seoScore)} 
                />
              </div>
            )}
            
            {/* Performance Score */}
            {report.auditResult?.performance !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Rendimiento</span>
                  <span className={`font-bold ${getScoreColorClass(report.auditResult.performance)}`}>
                    {report.auditResult.performance}%
                  </span>
                </div>
                <Progress 
                  value={report.auditResult.performance} 
                  className="h-2"
                  indicatorClassName={getProgressColorClass(report.auditResult.performance)} 
                />
              </div>
            )}
          </div>
          
          {/* Technical Indicators */}
          {report.auditResult?.technicalResults && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Estado Técnico</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <TechnicalIndicator 
                  name="SSL" 
                  status={report.auditResult.technicalResults.sslStatus} 
                />
                <TechnicalIndicator 
                  name="HTTPS" 
                  status={report.auditResult.technicalResults.httpsRedirection} 
                />
                <TechnicalIndicator 
                  name="Mobile" 
                  status={report.auditResult.technicalResults.mobileOptimization} 
                />
                <TechnicalIndicator 
                  name="Robots.txt" 
                  status={report.auditResult.technicalResults.robotsTxt} 
                />
                <TechnicalIndicator 
                  name="Sitemap" 
                  status={report.auditResult.technicalResults.sitemap} 
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report content - rendered as markdown */}
      {report.content ? (
        <div className="prose prose-blue max-w-none prose-headings:text-seo-blue prose-a:text-seo-purple">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Este informe no contiene contenido formateado.
        </div>
      )}
    </div>
  );
};

// Helper component for technical indicators
const TechnicalIndicator = ({ name, status }: { name: string, status: boolean | string }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
      {status === true || status === 'Válido' ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : status === false || status === 'Inválido' ? (
        <XCircle className="h-5 w-5 text-red-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-amber-500" />
      )}
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};

// Helper functions for styling based on scores
const getScoreColorClass = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

const getProgressColorClass = (score: number) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-amber-600";
  return "bg-red-600";
};
