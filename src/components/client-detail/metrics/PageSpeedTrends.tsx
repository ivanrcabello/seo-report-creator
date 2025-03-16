
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PageSpeedReport, 
  getPageSpeedHistory 
} from "@/services/pageSpeedService";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSpeedTrendsProps {
  clientId: string;
}

export const PageSpeedTrends = ({ clientId }: PageSpeedTrendsProps) => {
  const [history, setHistory] = useState<PageSpeedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getPageSpeedHistory(clientId);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching PageSpeed history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  const current = history[0];
  const previous = history.length > 1 ? history[1] : null;

  const getTrend = (current: number, previous: number | null) => {
    if (!previous) return { icon: <Minus className="h-4 w-4" />, variant: "outline" };
    if (current > previous) return { icon: <TrendingUp className="h-4 w-4" />, variant: "success" };
    if (current < previous) return { icon: <TrendingDown className="h-4 w-4" />, variant: "destructive" };
    return { icon: <Minus className="h-4 w-4" />, variant: "outline" };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tendencias de PageSpeed</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Performance Score */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Rendimiento
              <Badge 
                variant={getTrend(current.metrics.performance_score, previous?.metrics.performance_score).variant as any}
                className="flex items-center gap-1 ml-2"
              >
                {getTrend(current.metrics.performance_score, previous?.metrics.performance_score).icon}
                {previous ? `${current.metrics.performance_score - previous.metrics.performance_score}` : "–"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Puntuación actual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold mb-1">{current.metrics.performance_score}</div>
            <Progress 
              value={current.metrics.performance_score} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* Accessibility Score */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Accesibilidad
              <Badge 
                variant={getTrend(current.metrics.accessibility_score, previous?.metrics.accessibility_score).variant as any}
                className="flex items-center gap-1 ml-2"
              >
                {getTrend(current.metrics.accessibility_score, previous?.metrics.accessibility_score).icon}
                {previous ? `${current.metrics.accessibility_score - previous.metrics.accessibility_score}` : "–"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Puntuación actual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold mb-1">{current.metrics.accessibility_score}</div>
            <Progress 
              value={current.metrics.accessibility_score} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* Best Practices Score */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Mejores Prácticas
              <Badge 
                variant={getTrend(current.metrics.best_practices_score, previous?.metrics.best_practices_score).variant as any}
                className="flex items-center gap-1 ml-2"
              >
                {getTrend(current.metrics.best_practices_score, previous?.metrics.best_practices_score).icon}
                {previous ? `${current.metrics.best_practices_score - previous.metrics.best_practices_score}` : "–"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Puntuación actual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold mb-1">{current.metrics.best_practices_score}</div>
            <Progress 
              value={current.metrics.best_practices_score} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        {/* SEO Score */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              SEO
              <Badge 
                variant={getTrend(current.metrics.seo_score, previous?.metrics.seo_score).variant as any}
                className="flex items-center gap-1 ml-2"
              >
                {getTrend(current.metrics.seo_score, previous?.metrics.seo_score).icon}
                {previous ? `${current.metrics.seo_score - previous.metrics.seo_score}` : "–"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Puntuación actual
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold mb-1">{current.metrics.seo_score}</div>
            <Progress 
              value={current.metrics.seo_score} 
              className="h-2" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
