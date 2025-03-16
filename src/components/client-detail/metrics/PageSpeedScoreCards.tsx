
import { Card, CardContent } from "@/components/ui/card";
import { PageSpeedMetrics } from "@/services/pageSpeedService";
import { Zap, Layout, Code2, Search } from "lucide-react";
import { PageSpeedIndicator } from "./PageSpeedIndicator";

interface PageSpeedScoreCardsProps {
  metrics: PageSpeedMetrics;
}

export const PageSpeedScoreCards = ({ metrics }: PageSpeedScoreCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ScoreCard
        title="Rendimiento"
        score={metrics.performance_score}
        icon={<Zap className="h-5 w-5 text-yellow-500" />}
        description="Rapidez de carga"
      />
      
      <ScoreCard
        title="Accesibilidad"
        score={metrics.accessibility_score}
        icon={<Layout className="h-5 w-5 text-blue-500" />}
        description="Facilidad de uso"
      />
      
      <ScoreCard
        title="Buenas Prácticas"
        score={metrics.best_practices_score}
        icon={<Code2 className="h-5 w-5 text-indigo-500" />}
        description="Estándares web"
      />
      
      <ScoreCard
        title="SEO"
        score={metrics.seo_score}
        icon={<Search className="h-5 w-5 text-pink-500" />}
        description="Optimización para buscadores"
      />
    </div>
  );
};

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  description: string;
}

const ScoreCard = ({ title, score, icon, description }: ScoreCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <h3 className="font-medium">{title}</h3>
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          
          <PageSpeedIndicator score={score} showLabel={false} />
        </div>
        
        <div className="mt-2 relative pt-1">
          <div className="bg-gray-200 rounded-full h-2 w-full">
            <div 
              className={`h-2 rounded-full ${
                score >= 90 ? 'bg-green-500' : 
                score >= 50 ? 'bg-amber-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
