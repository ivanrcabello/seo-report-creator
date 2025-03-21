
import { ClientMetric } from "@/services/clientMetricsService";
import { MetricCard } from "@/components/MetricCard";
import { CircleCheck, CircleDashed, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useClientKeywords } from "./useClientKeywords";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageSpeedMetricCards } from "./PageSpeedMetricCards";

interface MetricsSummaryProps {
  currentMetric: ClientMetric;
  clientId: string;
}

export const MetricsSummary = ({ currentMetric, clientId }: MetricsSummaryProps) => {
  // Use the client ID from the URL params instead of trying to get it from the metric
  const { id: urlClientId } = useParams<{ id: string }>();
  const effectiveClientId = clientId || urlClientId || "";
  const { keywords, isLoading } = useClientKeywords(effectiveClientId);
  const [keywordsOnTarget, setKeywordsOnTarget] = useState(0);
  const [keywordsPercentage, setKeywordsPercentage] = useState(0);
  const [keywordsInTopTen, setKeywordsInTopTen] = useState(0);

  useEffect(() => {
    if (!isLoading && keywords.length > 0) {
      // Count keywords in top 10 positions
      const inTopTen = keywords.filter(k => k.position !== null && k.position <= 10).length;
      setKeywordsInTopTen(inTopTen);
      
      // Calculate keywords reaching their target
      const onTarget = keywords.filter(
        k => k.position !== null && k.position <= k.target_position
      ).length;
      setKeywordsOnTarget(onTarget);
      
      // Calculate percentage
      const percentage = keywords.length > 0 
        ? Math.round((onTarget / keywords.length) * 100) 
        : 0;
      setKeywordsPercentage(percentage);
      
      console.log("Keywords stats updated:", {
        total: keywords.length,
        inTopTen,
        onTarget,
        percentage
      });
    }
  }, [keywords, isLoading]);

  const formatPercentage = (value: number, goal: number) => {
    const percentage = (value / goal) * 100;
    return Math.min(percentage, 100).toFixed(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Web Visits */}
        <MetricCard 
          title="Visitas Web"
          value={currentMetric.web_visits}
          target={currentMetric.web_visits * 1.2}
          icon={<CircleDashed className="h-8 w-8" />}
          footer={
            <div className="w-full mt-2">
              <Progress 
                value={Number(formatPercentage(currentMetric.web_visits, currentMetric.web_visits * 1.2))} 
                className="h-2" 
              />
            </div>
          }
        />
        
        {/* Keywords in Top 10 */}
        <MetricCard
          title="Keywords en Top 10"
          value={currentMetric.keywords_top10}
          target={currentMetric.keywords_top10 * 1.5}
          icon={<CircleCheck className="h-8 w-8" />}
          trend={
            <Badge 
              variant={keywordsInTopTen > currentMetric.keywords_top10 ? "success" : "destructive"}
            >
              {keywordsInTopTen > currentMetric.keywords_top10 ? (
                <span className="flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {keywordsInTopTen - currentMetric.keywords_top10}
                </span>
              ) : (
                <span className="flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {currentMetric.keywords_top10 - keywordsInTopTen}
                </span>
              )}
            </Badge>
          }
          footer={
            <div className="w-full mt-2">
              <Progress 
                value={Number(formatPercentage(currentMetric.keywords_top10, currentMetric.keywords_top10 * 1.5))} 
                className="h-2" 
              />
            </div>
          }
        />
        
        {/* Conversions */}
        <MetricCard
          title="Conversiones"
          value={currentMetric.conversions}
          target={currentMetric.conversion_goal}
          icon={<CircleCheck className="h-8 w-8" />}
          footer={
            <div className="w-full mt-2">
              <Progress 
                value={Number(formatPercentage(currentMetric.conversions, currentMetric.conversion_goal))} 
                className="h-2" 
              />
            </div>
          }
        />
        
        {/* Keywords Target Progress */}
        <MetricCard
          title="Keywords en Objetivo"
          value={keywordsOnTarget}
          target={keywords.length}
          icon={<CircleCheck className="h-8 w-8" />}
          trend={
            <Badge variant={keywordsPercentage >= 50 ? "success" : "destructive"}>
              {keywordsPercentage}%
            </Badge>
          }
          footer={
            <div className="w-full mt-2">
              <Progress 
                value={keywordsPercentage} 
                className="h-2" 
              />
            </div>
          }
        />
      </div>
      
      {/* PageSpeed Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PageSpeedMetricCards clientId={effectiveClientId} />
      </div>
    </div>
  );
};
