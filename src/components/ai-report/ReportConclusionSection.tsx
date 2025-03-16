
import { AIReport } from "@/services/aiReportService";
import { ReportSection } from "@/components/seo-report/ReportSection";
import { FileCheck, Calendar } from "lucide-react";

interface ReportConclusionSectionProps {
  report: AIReport;
}

export const ReportConclusionSection = ({ report }: ReportConclusionSectionProps) => {
  return (
    <ReportSection
      title="Conclusión y Cronograma"
      icon={<FileCheck className="h-5 w-5 text-blue-600" />}
      gradientFrom="from-blue-50"
      gradientTo="to-blue-50/30"
      titleColor="text-blue-800"
      borderColor="border-blue-200"
    >
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Recomendación Final</h3>
          <p className="text-gray-700">{report.conclusion}</p>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            Cronograma Estimado
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Fase 1: Optimización Técnica (Mes 1)</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Auditoría técnica completa y correcciones</li>
                <li>Implementación de schema markup</li>
                <li>Optimización de la velocidad de carga</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Fase 2: Contenido y Estructura (Meses 2-3)</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Optimización de contenido existente</li>
                <li>Creación de nuevo contenido enfocado en keywords</li>
                <li>Mejora de estructura de URLs y arquitectura web</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Fase 3: SEO Off-Page (Meses 3-6)</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Implementación de estrategia de linkbuilding</li>
                <li>Optimización de perfiles en directorios locales</li>
                <li>Gestión de redes sociales y reputación online</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ReportSection>
  );
};
