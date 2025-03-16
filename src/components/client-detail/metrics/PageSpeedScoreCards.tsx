
import { PageSpeedMetrics } from "@/services/pageSpeedService";
import { Gauge, BarChart2, Shield, Search } from "lucide-react";

interface PageSpeedScoreCardsProps {
  metrics: PageSpeedMetrics;
}

export const PageSpeedScoreCards = ({ metrics }: PageSpeedScoreCardsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50";
    if (score >= 50) return "text-orange-500 bg-orange-50";
    return "text-red-500 bg-red-50";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${getScoreColor(metrics.performance_score).split(' ')[1]}`}>
            <Gauge className={`h-5 w-5 ${getScoreColor(metrics.performance_score).split(' ')[0]}`} />
          </div>
          <h3 className="font-medium">Rendimiento</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(metrics.performance_score).split(' ')[0]}`}>
          {metrics.performance_score}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${getScoreColor(metrics.accessibility_score).split(' ')[1]}`}>
            <BarChart2 className={`h-5 w-5 ${getScoreColor(metrics.accessibility_score).split(' ')[0]}`} />
          </div>
          <h3 className="font-medium">Accesibilidad</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(metrics.accessibility_score).split(' ')[0]}`}>
          {metrics.accessibility_score}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${getScoreColor(metrics.best_practices_score).split(' ')[1]}`}>
            <Shield className={`h-5 w-5 ${getScoreColor(metrics.best_practices_score).split(' ')[0]}`} />
          </div>
          <h3 className="font-medium">Buenas Prácticas</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(metrics.best_practices_score).split(' ')[0]}`}>
          {metrics.best_practices_score}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full ${getScoreColor(metrics.seo_score).split(' ')[1]}`}>
            <Search className={`h-5 w-5 ${getScoreColor(metrics.seo_score).split(' ')[0]}`} />
          </div>
          <h3 className="font-medium">SEO</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(metrics.seo_score).split(' ')[0]}`}>
          {metrics.seo_score}
        </div>
      </div>
    </div>
  );
};
