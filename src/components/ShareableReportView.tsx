import { useState } from "react";
import { ClientReport } from "@/types/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCards } from "@/components/seo-report/ScoreCards";
import { MetricCards } from "@/components/seo-report/MetricCards";
import { SeoDetailsCard } from "@/components/seo-report/SeoDetailsCard";
import { Recommendations } from "@/components/seo-report/Recommendations";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, ChevronDown, ChevronUp, List } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  const [viewTab, setViewTab] = useState("formatted");
  const [keywordsExpanded, setKeywordsExpanded] = useState(false);

  const extractSections = () => {
    if (!report.content) return [];
    
    const sectionRegex = /^#{2}\s+(.*)$/gm;
    const matches = [...report.content.matchAll(sectionRegex)];
    
    return matches.map(match => ({
      title: match[1],
      id: match[1].toLowerCase().replace(/\s+/g, '-')
    }));
  };
  
  const sections = extractSections();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!report) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay informe disponible</h3>
        <p className="text-gray-500">Este informe no existe o no está disponible</p>
      </div>
    );
  }

  console.log("Report content in ShareableReportView:", report.content ? report.content.substring(0, 100) + "..." : "No content");

  if (report.content) {
    // Process the content with more careful regex replacements
    const formattedContent = report.content
      .replace(/^#{2}\s+(.*?)$/gm, '<h2 id="$1" class="text-2xl font-bold text-blue-600 mt-6 mb-4 scroll-mt-16">$1</h2>')
      .replace(/^#{3}\s+(.*?)$/gm, '<h3 class="text-xl font-semibold text-purple-600 mt-5 mb-3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="my-3">')
      .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
      .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
      .replace(/^<\/p>/, '')
      .replace(/<p>$/, '');
      
    // Format the content for printing to avoid regex issues
    const printContent = report.content
      .replace(/^#{2}\s+(.*?)$/gm, '<h2 class="text-2xl font-bold text-blue-600 mt-6 mb-4">$1</h2>')
      .replace(/^#{3}\s+(.*?)$/gm, '<h3 class="text-xl font-semibold text-purple-600 mt-5 mb-3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="my-3">')
      .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
      .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
      .replace(/^<\/p>/, '')
      .replace(/<p>$/, '');

    return (
      <div className="p-4">
        {sections.length > 0 && (
          <div className="mb-6 flex justify-end print:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <List className="h-4 w-4" />
                  Navegar por secciones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white">
                {sections.map((section, index) => (
                  <DropdownMenuItem 
                    key={index}
                    onClick={() => scrollToSection(section.id)}
                    className="cursor-pointer"
                  >
                    {section.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        <Tabs defaultValue={viewTab} onValueChange={setViewTab} className="w-full print:hidden">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="formatted" className="flex-1">Vista Formateada</TabsTrigger>
            <TabsTrigger value="markdown" className="flex-1">Markdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formatted" className="mt-2">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />

              {report.content.includes("Análisis de Palabras Clave") && (
                <div className="mt-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="keywords">
                      <AccordionTrigger className="text-lg font-semibold text-blue-600">
                        Ver todas las palabras clave
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-80 overflow-y-auto">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {report.analyticsData?.auditResult?.keywords?.map((keyword, index) => (
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
              )}
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

        <div className="hidden print:block">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: printContent }} />

            {report.analyticsData?.auditResult?.keywords && report.analyticsData.auditResult.keywords.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    );
  }

  if (report.analyticsData?.auditResult) {
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
  }

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
