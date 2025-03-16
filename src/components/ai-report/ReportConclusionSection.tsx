
import { AIReport } from "@/services/aiReportService";
import { Clock } from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";

interface ReportConclusionSectionProps {
  report: AIReport;
}

export const ReportConclusionSection = ({ report }: ReportConclusionSectionProps) => {
  return (
    <ReportSection
      title="Conclusión y Siguientes Pasos"
      icon={<Clock className="h-5 w-5 text-amber-600" />}
      gradientFrom="from-amber-50"
      gradientTo="to-amber-50/30"
      titleColor="text-amber-800"
      borderColor="border-amber-200"
    >
      <p className="text-gray-700 leading-relaxed mb-6">{report.conclusion}</p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Cronograma Estimado</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 1</div>
          <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
            <p className="text-gray-700">Auditoría completa e implementación de cambios técnicos iniciales.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 2-3</div>
          <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
            <p className="text-gray-700">Optimización de contenido existente y creación de nuevo contenido optimizado.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 text-amber-800 font-medium px-3 py-2 rounded-md text-sm w-24 text-center shrink-0">Mes 4-6</div>
          <div className="bg-white border border-gray-200 rounded-md p-3 flex-1">
            <p className="text-gray-700">Primeros resultados visibles. Implementación de estrategias de linkbuilding.</p>
          </div>
        </div>
      </div>
    </ReportSection>
  );
};
