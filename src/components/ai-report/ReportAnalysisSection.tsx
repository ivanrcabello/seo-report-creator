
import { AIReport } from "@/services/aiReportService";
import { BarChart, Check } from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";

interface ReportAnalysisSectionProps {
  report: AIReport;
}

export const ReportAnalysisSection = ({ report }: ReportAnalysisSectionProps) => {
  return (
    <ReportSection
      title="Análisis Actual de la Web"
      icon={<BarChart className="h-5 w-5 text-purple-600" />}
      gradientFrom="from-purple-50"
      gradientTo="to-purple-50/30"
      titleColor="text-purple-800"
      borderColor="border-purple-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
            <h3 className="font-medium text-purple-900">Authority Score</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">{report.authorityScore}<span className="text-sm text-gray-500">/100</span></p>
          <p className="text-sm text-gray-600 mt-1">{report.authorityScoreComment}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            <h3 className="font-medium text-blue-900">Tráfico Orgánico</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">{report.organicTraffic} <span className="text-sm text-gray-500">visitas/mes</span></p>
          <p className="text-sm text-gray-600 mt-1">{report.organicTrafficComment}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <h3 className="font-medium text-green-900">Palabras Clave</h3>
          </div>
          <p className="text-3xl font-bold text-green-700">{report.keywordsPositioned}</p>
          <p className="text-sm text-gray-600 mt-1">{report.keywordsComment}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
            <h3 className="font-medium text-amber-900">Backlinks</h3>
          </div>
          <p className="text-3xl font-bold text-amber-700">{report.backlinksCount}</p>
          <p className="text-sm text-gray-600 mt-1">{report.backlinksComment}</p>
        </div>
      </div>

      {report.priorityKeywords && report.priorityKeywords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Palabras Clave Prioritarias</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Palabra Clave</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Posición</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Volumen</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Dificultad</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Recomendación</th>
                </tr>
              </thead>
              <tbody>
                {report.priorityKeywords.map((keyword, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border px-4 py-2 font-medium">{keyword.keyword}</td>
                    <td className="border px-4 py-2">{keyword.position}</td>
                    <td className="border px-4 py-2">{keyword.volume}</td>
                    <td className="border px-4 py-2">{keyword.difficulty}/100</td>
                    <td className="border px-4 py-2 text-sm">{keyword.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report.competitors && report.competitors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Comparativa con Competidores</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Competidor</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Tráfico</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Keywords</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Backlinks</th>
                  <th className="px-4 py-2 text-left text-purple-900 font-medium">Análisis</th>
                </tr>
              </thead>
              <tbody>
                {report.competitors.map((competitor, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border px-4 py-2 font-medium">{competitor.name}</td>
                    <td className="border px-4 py-2">{competitor.trafficScore}</td>
                    <td className="border px-4 py-2">{competitor.keywordsCount}</td>
                    <td className="border px-4 py-2">{competitor.backlinksCount}</td>
                    <td className="border px-4 py-2 text-sm">{competitor.analysis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ReportSection>
  );
};
