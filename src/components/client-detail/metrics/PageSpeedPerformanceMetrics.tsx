
import { PageSpeedMetrics } from "@/services/pageSpeedService";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Legend, CartesianGrid } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface PageSpeedPerformanceMetricsProps {
  metrics: PageSpeedMetrics;
}

export const PageSpeedPerformanceMetrics = ({ metrics }: PageSpeedPerformanceMetricsProps) => {
  const formatMs = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${Math.round(ms)}ms`;
  };

  // Define thresholds for performance metrics
  const thresholds = {
    fcp: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
    si: { good: 3400, needsImprovement: 5800 },  // Speed Index
    lcp: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
    tti: { good: 3800, needsImprovement: 7300 }, // Time to Interactive
    tbt: { good: 200, needsImprovement: 600 },   // Total Blocking Time
    cls: { good: 0.1, needsImprovement: 0.25 }   // Cumulative Layout Shift
  };
  
  const getScoreColor = (value: number, metric: string) => {
    if (metric === 'cls') {
      if (value <= thresholds.cls.good) return "bg-green-500";
      if (value <= thresholds.cls.needsImprovement) return "bg-orange-500";
      return "bg-red-500";
    } else {
      if (value <= thresholds[metric as keyof typeof thresholds].good) return "bg-green-500";
      if (value <= thresholds[metric as keyof typeof thresholds].needsImprovement) return "bg-orange-500";
      return "bg-red-500";
    }
  };

  const metricsData = [
    {
      name: "First Contentful Paint",
      value: metrics.first_contentful_paint,
      formatted: formatMs(metrics.first_contentful_paint),
      key: "fcp",
      description: "Tiempo hasta que el primer texto o imagen aparece"
    },
    {
      name: "Speed Index",
      value: metrics.speed_index,
      formatted: formatMs(metrics.speed_index),
      key: "si",
      description: "Qué tan rápido el contenido se hace visualmente completo"
    },
    {
      name: "Largest Contentful Paint",
      value: metrics.largest_contentful_paint,
      formatted: formatMs(metrics.largest_contentful_paint),
      key: "lcp",
      description: "Tiempo hasta que el contenido principal es visible"
    },
    {
      name: "Time to Interactive",
      value: metrics.time_to_interactive,
      formatted: formatMs(metrics.time_to_interactive),
      key: "tti",
      description: "Tiempo hasta que la página es totalmente interactiva"
    },
    {
      name: "Total Blocking Time",
      value: metrics.total_blocking_time,
      formatted: formatMs(metrics.total_blocking_time),
      key: "tbt",
      description: "Tiempo total que la página está bloqueada para responder"
    }
  ];

  // Use a different representation for CLS
  const clsValue = metrics.cumulative_layout_shift.toFixed(3);
  const clsThreshold = getScoreColor(metrics.cumulative_layout_shift, 'cls');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h3 className="text-lg font-medium mb-4">Métricas de Rendimiento</h3>
        
        <div className="h-[300px] w-full">
          <ChartContainer config={{}} className="h-full w-full">
            <BarChart 
              data={metricsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatMs(value)}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent formatter={(value, name, props) => [
                    formatMs(Number(value)),
                    props.payload.name,
                  ]} />
                }
              />
              <Bar dataKey="value" fill="#8884d8">
                {metricsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getScoreColor(entry.value, entry.key)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metricsData.map((metric) => (
          <div 
            key={metric.key}
            className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-medium">{metric.name}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-500 text-sm">{metric.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getScoreColor(metric.value, metric.key)}`}></div>
              <span className="font-mono font-medium">{metric.formatted}</span>
            </div>
          </div>
        ))}
        
        <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-medium">Cumulative Layout Shift</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mide la estabilidad visual de la página (cambios de diseño durante la carga)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-gray-500 text-sm">Estabilidad visual de la página</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${clsThreshold}`}></div>
            <span className="font-mono font-medium">{clsValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
