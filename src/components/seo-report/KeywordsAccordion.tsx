
import { ClientReport } from "@/types/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface KeywordsAccordionProps {
  report: ClientReport;
  isPrintView?: boolean;
}

export const KeywordsAccordion = ({ report, isPrintView = false }: KeywordsAccordionProps) => {
  if (!report.analyticsData?.auditResult?.keywords?.length) return null;
  
  // For print view, show a different layout
  if (isPrintView) {
    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Palabras Clave Analizadas:</h3>
        <ul className="grid grid-cols-2 gap-2">
          {report.analyticsData.auditResult.keywords.map((keyword, index) => (
            <li key={index} className="flex justify-between p-1 text-sm border-b border-gray-100">
              <span>{keyword.word}</span>
              <span>
                {!keyword.position ? "No posicionada" : `Pos. ${keyword.position}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Regular view with accordion
  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="keywords">
          <AccordionTrigger className="text-lg font-semibold text-blue-600">
            Ver todas las palabras clave
          </AccordionTrigger>
          <AccordionContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-80 overflow-y-auto">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {report.analyticsData.auditResult.keywords.map((keyword, index) => (
                  <li key={index} className="flex justify-between p-2 border-b border-gray-200 text-sm">
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
    </div>
  );
};
