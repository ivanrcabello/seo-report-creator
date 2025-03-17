
import { ClientReport } from "@/types/client";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalyticsReportViewProps {
  report: ClientReport;
}

export const AnalyticsReportView = ({ report }: AnalyticsReportViewProps) => {
  if (!report.analyticsData?.auditResult) return null;
  
  const auditResult = report.analyticsData.auditResult;
  
  return (
    <div className="space-y-8">
      <ScoreCards auditResult={auditResult} />
      <MetricCards auditResult={auditResult} />
      
      {auditResult.keywords && auditResult.keywords.length > 5 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="keywords">
            <AccordionTrigger className="text-lg font-semibold">
              Palabras Clave ({auditResult.keywords.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {auditResult.keywords.map((keyword, index) => (
                    <li key={index} className="flex justify-between p-2 border-b border-gray-200">
                      <span className="font-medium">{keyword.word}</span>
                      <span className={
                        keyword.position && keyword.position <= 3 ? "text-green-600 font-semibold" : 
                        keyword.position && keyword.position <= 10 ? "text-amber-600 font-semibold" : 
                        "text-gray-600"
                      }>
                        {!keyword.position ? "No posicionada" : `Pos. ${keyword.position}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      <SeoDetailsCard auditResult={auditResult} />
      <Recommendations auditResult={auditResult} />
      
      {report.notes && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <h3 className="text-lg font-semibold mb-4">Notas adicionales</h3>
          <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
        </div>
      )}
    </div>
  );
};
