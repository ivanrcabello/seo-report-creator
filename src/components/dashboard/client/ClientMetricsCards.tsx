
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart2, MessageSquare } from "lucide-react";
import { ClientMetric } from "@/services/clientMetricsService";

interface ClientMetricsCardsProps {
  metrics: ClientMetric;
}

export function ClientMetricsCards({ metrics }: ClientMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Visitas web
          </CardTitle>
          <CardDescription>Este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+{metrics.web_visits}%</div>
          <div className="text-sm text-gray-500 mt-1">Incremento desde el mes pasado</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
            Keywords TOP10
          </CardTitle>
          <CardDescription>Posiciones 1-10 en Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{metrics.keywords_top10}</div>
          <div className="text-sm text-gray-500 mt-1">
            <Badge className="mr-2 bg-blue-100 text-blue-700 hover:bg-blue-200">+2 este mes</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
            Conversiones obtenidas
          </CardTitle>
          <CardDescription>Meta: {metrics.conversion_goal}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-600">{metrics.conversions}</div>
            <Progress 
              value={(metrics.conversions / metrics.conversion_goal) * 100} 
              className="h-2" 
            />
            <div className="text-sm text-gray-500">
              {((metrics.conversions / metrics.conversion_goal) * 100).toFixed(0)}% del objetivo mensual
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
