
import { AIReport } from "@/services/aiReportService";
import { FileText, TrendingUp, Link, Activity } from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";

interface ReportAnalysisSectionProps {
  report: AIReport;
}

export const ReportAnalysisSection = ({ report }: ReportAnalysisSectionProps) => {
  return (
    <ReportSection
      title="Análisis de la Situación Actual"
      icon={<Activity className="h-5 w-5 text-purple-600" />}
      gradientFrom="from-purple-50"
      gradientTo="to-purple-50/30"
      titleColor="text-purple-800"
      borderColor="border-purple-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600 mr-2" />
              <h4 className="text-sm font-semibold text-purple-900">Authority Score</h4>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-purple-700">{report.authorityScore}/100</div>
              <div className="text-xs text-gray-500 pb-1">Puntuación de autoridad</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{report.authorityScoreComment}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600 mr-2" />
              <h4 className="text-sm font-semibold text-purple-900">Tráfico Orgánico</h4>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-purple-700">{report.organicTraffic}</div>
              <div className="text-xs text-gray-500 pb-1">visitas/mes</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{report.organicTrafficComment}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 text-purple-600 mr-2" />
              <h4 className="text-sm font-semibold text-purple-900">Keywords Posicionadas</h4>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-purple-700">{report.keywordsPositioned}</div>
              <div className="text-xs text-gray-500 pb-1">palabras clave</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{report.keywordsComment}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center mb-2">
              <Link className="h-4 w-4 text-purple-600 mr-2" />
              <h4 className="text-sm font-semibold text-purple-900">Backlinks</h4>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-purple-700">{report.backlinksCount}</div>
              <div className="text-xs text-gray-500 pb-1">enlaces entrantes</div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{report.backlinksComment}</p>
          </div>
        </div>
      </div>
      
      {report.priorityKeywords && report.priorityKeywords.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Palabras Clave Prioritarias</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volumen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dificultad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendación</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.priorityKeywords.map((keyword, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{keyword.keyword}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{keyword.position || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{keyword.volume || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{keyword.difficulty || 'N/A'}/100</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{keyword.recommendation || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {report.competitors && report.competitors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Análisis de Competidores</h3>
          <div className="grid grid-cols-1 gap-4">
            {report.competitors.map((competitor, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                <h4 className="font-semibold text-purple-900 mb-2">{competitor.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Traffic Score:</span>
                    <span className="block font-medium">{competitor.trafficScore || 'N/A'}/100</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Keywords:</span>
                    <span className="block font-medium">{competitor.keywordsCount || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Backlinks:</span>
                    <span className="block font-medium">{competitor.backlinksCount || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{competitor.analysis}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ReportSection>
  );
};
