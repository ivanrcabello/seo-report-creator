
import { useState } from "react";
import { ClientReport } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle } from "lucide-react";

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

  // If the report has content, show it formatted
  if (report.content) {
    return (
      <div className="p-4">
        <Tabs defaultValue={viewTab} onValueChange={setViewTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="formatted" className="flex-1">Vista Formateada</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formatted" className="mt-2">
            <div className="prose max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: report.content
                    .replace(/^#{2} (.*?)$/gm, '<h2 class="text-2xl font-bold text-seo-blue mt-6 mb-4">$1</h2>')
                    .replace(/^#{3} (.*?)$/gm, '<h3 class="text-xl font-semibold text-seo-purple mt-5 mb-3">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="my-3">')
                    .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
                    .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
                    .replace(/^<\/p>/, '')
                    .replace(/<p>$/, '')
                }} 
              />
            </div>
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
      </div>
    );
  }

  // If the report has analyticsData with auditResult, show the SEO components
  if (report.analyticsData?.auditResult) {
    const auditResult = report.analyticsData.auditResult;
    return (
      <div className="space-y-8">
        <ScoreCards auditResult={auditResult} />
        <MetricCards auditResult={auditResult} />
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
  }

  // Fallback if neither content nor auditResult is available
  return (
    <div className="p-10 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Este informe no contiene datos de análisis</h3>
      <p className="text-gray-500 mb-6">El informe fue creado pero no contiene datos de análisis SEO.</p>
      
      {report.notes && (
        <div className="text-left bg-white p-6 rounded-lg border border-gray-200 mt-4">
          <h4 className="font-medium mb-2">Notas:</h4>
          <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
        </div>
      )}
    </div>
  );
};
