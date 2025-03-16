
import { AIReport } from "@/services/aiReportService";
import { FileText, Phone, Mail } from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";
import { Accordion } from "@/components/ui/accordion";
import { StrategySection } from "@/components/seo-report/StrategySection";
import { ReportAnalysisSection } from "./ReportAnalysisSection";
import { ReportPackagesSection } from "./ReportPackagesSection";
import { ReportConclusionSection } from "./ReportConclusionSection";

interface ReportContentProps {
  report: AIReport;
}

export const ReportContent = ({ report }: ReportContentProps) => {
  if (report.content) {
    return (
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
    );
  }

  return (
    <>
      {/* Introducción */}
      <ReportSection
        title="Introducción"
        icon={<FileText className="h-5 w-5 text-blue-600" />}
        gradientFrom="from-blue-50"
        gradientTo="to-blue-50/30"
        titleColor="text-blue-800"
        borderColor="border-blue-200"
      >
        <p className="text-gray-700 leading-relaxed">{report.introduction}</p>
      </ReportSection>

      {/* Análisis Actual */}
      <ReportAnalysisSection report={report} />

      {/* Estrategia Propuesta */}
      <ReportSection
        title="Estrategia Propuesta"
        icon={<FileText className="h-5 w-5 text-green-600" />}
        gradientFrom="from-green-50"
        gradientTo="to-green-50/30"
        titleColor="text-green-800"
        borderColor="border-green-200"
      >
        <Accordion type="multiple" className="w-full">
          <StrategySection 
            strategy={report.strategy} 
            title="Optimización Técnica y On-Page" 
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            strategyType="technicalOptimization"
            iconColor="text-blue-500"
          />
          
          <StrategySection 
            strategy={report.strategy} 
            title="SEO Local y Geolocalización" 
            icon={<FileText className="h-5 w-5 text-green-600" />}
            strategyType="localSeo"
            iconColor="text-green-500"
          />
          
          <StrategySection 
            strategy={report.strategy} 
            title="Creación de Contenido y Blog" 
            icon={<FileText className="h-5 w-5 text-purple-600" />}
            strategyType="contentCreation"
            iconColor="text-purple-500"
          />
          
          <StrategySection 
            strategy={report.strategy} 
            title="Estrategia de Linkbuilding" 
            icon={<FileText className="h-5 w-5 text-amber-600" />}
            strategyType="linkBuilding"
            iconColor="text-amber-500"
          />
        </Accordion>
      </ReportSection>

      {/* Planes de Tarifas */}
      <ReportPackagesSection report={report} />

      {/* Conclusión y Cronograma */}
      <ReportConclusionSection report={report} />

      {/* Contacto */}
      <ReportSection
        title="Contacto"
        icon={<Phone className="h-5 w-5 text-gray-600" />}
        gradientFrom="from-gray-50"
        gradientTo="to-gray-50/30"
        titleColor="text-gray-800"
        borderColor="border-gray-200"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-indigo-600" />
            <a href={`mailto:${report.contactEmail}`} className="text-indigo-600 hover:underline">
              {report.contactEmail || "info@empresa.com"}
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-indigo-600" />
            <a href={`tel:${report.contactPhone}`} className="text-indigo-600 hover:underline">
              {report.contactPhone || "+34 123 456 789"}
            </a>
          </div>
        </div>
      </ReportSection>
    </>
  );
};
