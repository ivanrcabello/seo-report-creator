
import { ClientMetric } from "@/services/clientMetricsService";
import { MetricCard } from "@/components/MetricCard";
import { TrendingUp, BarChart2, MousePointer, Award, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useClientKeywords } from "./useClientKeywords";
import { useEffect, useState } from "react";

interface MetricsSummaryProps {
  currentMetric: ClientMetric;
}

export const MetricsSummary = ({ currentMetric }: MetricsSummaryProps) => {
  const { keywords, isLoading } = useClientKeywords(currentMetric.client_id || "");
  const [keywordStats, setKeywordStats] = useState({
    total: 0,
    onTarget: 0
  });

  useEffect(() => {
    if (!isLoading && keywords.length > 0) {
      const onTarget = keywords.filter(
        kw => kw.position !== null && kw.position <= kw.target_position
      ).length;
      
      setKeywordStats({
        total: keywords.length,
        onTarget
      });
    }
  }, [keywords, isLoading]);

  const conversionPercentage = Math.min(
    100,
    Math.round((currentMetric.conversions / (currentMetric.conversion_goal || 1)) * 100)
  );
  
  const getConversionColor = () => {
    if (conversionPercentage >= 80) return "text-green-600";
    if (conversionPercentage >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const keywordPercentage = keywordStats.total > 0
    ? Math.round((keywordStats.onTarget / keywordStats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Visitas Web"
        value={`+${currentMetric.web_visits}%`}
        description="Incremento en el tráfico web desde el mes pasado"
        color="bg-green-100 text-green-600"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Keywords en TOP10"
        value={currentMetric.keywords_top10.toString()}
        description="Palabras clave posicionadas en las primeras 10 posiciones de Google"
        color="bg-blue-100 text-blue-600"
        icon={<BarChart2 className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Keywords Objetivo"
        value={
          isLoading ? (
            "Cargando..."
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={keywordPercentage >= 70 ? "text-green-600" : keywordPercentage >= 40 ? "text-amber-600" : "text-red-600"}>
                  {keywordStats.onTarget}
                </span>
                <span className="text-gray-500 text-sm">/ {keywordStats.total}</span>
              </div>
              <Progress value={keywordPercentage} className="h-2" />
              <div className="text-xs text-gray-500">
                {keywordPercentage}% en posición objetivo
              </div>
            </div>
          )
        }
        description="Palabras clave que alcanzan su posición objetivo"
        color="bg-purple-100 text-purple-600"
        icon={<Search className="h-5 w-5" />}
      />
      
      <MetricCard
        title="Conversiones"
        value={
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={getConversionColor()}>{currentMetric.conversions}</span>
              <span className="text-gray-500 text-sm">/ {currentMetric.conversion_goal}</span>
            </div>
            <Progress value={conversionPercentage} className="h-2" />
            <div className="text-xs text-gray-500">
              {conversionPercentage}% del objetivo mensual
            </div>
          </div>
        }
        description="Número de conversiones vs objetivo mensual"
        color="bg-orange-100 text-orange-600"
        icon={<Award className="h-5 w-5" />}
      />
    </div>
  );
};
