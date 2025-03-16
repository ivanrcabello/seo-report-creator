import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { getPageSpeedReport, PageSpeedReport, PageSpeedMetrics } from "@/services/pagespeed";
import { LineChart, Gauge, Zap, MousePointer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSpeedMetricCardsProps {
  clientId?: string;
  metrics?: PageSpeedMetrics;
}

export const PageSpeedMetricCards = ({ clientId, metrics }: PageSpeedMetricCardsProps) => {
  const [report, setReport] = useState<PageSpeedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch report if clientId is provided and metrics are not provided
    if (clientId && !metrics) {
      const fetchReport = async () => {
        setIsLoading(true);
        try {
          const data = await getPageSpeedReport(clientId);
          setReport(data);
        } catch (error) {
          console.error("Error fetching PageSpeed report:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchReport();
    } else if (metrics) {
      // If metrics are provided directly, use them
      setReport({ metrics, audits: [] });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [clientId, metrics]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  if (!report || !report.metrics) {
    return null;
  }
  
  // Format performance metrics to be more readable
  const formatTime = (ms: number): string => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
  
  const getLCPStatus = (lcp: number) => {
    // Thresholds based on Core Web Vitals
    if (lcp <= 2500) return { status: "good", color: "bg-green-50" };
    if (lcp <= 4000) return { status: "needs improvement", color: "bg-orange-50" };
    return { status: "poor", color: "bg-red-50" };
  };
  
  const getTBTStatus = (tbt: number) => {
    // Thresholds based on Core Web Vitals
    if (tbt <= 200) return { status: "good", color: "bg-green-50" };
    if (tbt <= 600) return { status: "needs improvement", color: "bg-orange-50" };
    return { status: "poor", color: "bg-red-50" };
  };
  
  const getCLSStatus = (cls: number) => {
    // Thresholds based on Core Web Vitals
    if (cls <= 0.1) return { status: "good", color: "bg-green-50" };
    if (cls <= 0.25) return { status: "needs improvement", color: "bg-orange-50" };
    return { status: "poor", color: "bg-red-50" };
  };
  
  return (
    <>
      {/* Performance Score Card */}
      <MetricCard
        title="Rendimiento Web"
        value={`${report.metrics.performance_score}/100`}
        icon={<Gauge className="h-5 w-5 text-blue-500" />}
        color="bg-blue-50"
        description="Puntuación global de rendimiento web según PageSpeed Insights"
        footer={
          <div className="w-full mt-2">
            <Progress 
              value={report.metrics.performance_score} 
              className="h-2" 
            />
          </div>
        }
      />
      
      {/* LCP Card */}
      <MetricCard
        title="Largest Contentful Paint"
        value={formatTime(report.metrics.largest_contentful_paint)}
        icon={<LineChart className="h-5 w-5 text-purple-500" />}
        color={getLCPStatus(report.metrics.largest_contentful_paint).color}
        description="Tiempo que tarda en renderizarse el contenido principal visible"
        trend={
          <Badge 
            variant={getLCPStatus(report.metrics.largest_contentful_paint).status === "good" ? "success" : 
                  getLCPStatus(report.metrics.largest_contentful_paint).status === "needs improvement" ? "secondary" : "destructive"}
          >
            {getLCPStatus(report.metrics.largest_contentful_paint).status}
          </Badge>
        }
      />
      
      {/* TBT Card */}
      <MetricCard
        title="Total Blocking Time"
        value={formatTime(report.metrics.total_blocking_time)}
        icon={<Zap className="h-5 w-5 text-amber-500" />}
        color={getTBTStatus(report.metrics.total_blocking_time).color}
        description="Tiempo total en que la interfaz principal está bloqueada"
        trend={
          <Badge 
            variant={getTBTStatus(report.metrics.total_blocking_time).status === "good" ? "success" : 
                  getTBTStatus(report.metrics.total_blocking_time).status === "needs improvement" ? "secondary" : "destructive"}
          >
            {getTBTStatus(report.metrics.total_blocking_time).status}
          </Badge>
        }
      />
      
      {/* CLS Card */}
      <MetricCard
        title="Cumulative Layout Shift"
        value={report.metrics.cumulative_layout_shift.toFixed(3)}
        icon={<MousePointer className="h-5 w-5 text-green-500" />}
        color={getCLSStatus(report.metrics.cumulative_layout_shift).color}
        description="Medida de estabilidad visual durante la carga"
        trend={
          <Badge 
            variant={getCLSStatus(report.metrics.cumulative_layout_shift).status === "good" ? "success" : 
                  getCLSStatus(report.metrics.cumulative_layout_shift).status === "needs improvement" ? "secondary" : "destructive"}
          >
            {getCLSStatus(report.metrics.cumulative_layout_shift).status}
          </Badge>
        }
      />
    </>
  );
};
