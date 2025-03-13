
import { ClientReport } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Search, 
  MousePointerClick, 
  TrendingUp,
  Eye,
  Clock,
  Globe
} from "lucide-react";

interface ShareableReportViewProps {
  report: ClientReport;
}

export const ShareableReportView = ({ report }: ShareableReportViewProps) => {
  // Colores para los gráficos
  const colors = [
    "#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", 
    "#84cc16", "#eab308", "#f59e0b", "#f97316", "#ef4444"
  ];

  // Función para formatear números grandes
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Función para formatear porcentajes
  const formatPercent = (num: number) => {
    return num.toFixed(1) + '%';
  };

  // Función para formatear tiempo en segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <BarChart className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          
          {report.analyticsData && (
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <LineChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          )}
          
          {report.searchConsoleData && (
            <TabsTrigger value="searchconsole" className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              <span>Search Console</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="recommendations" className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>Recomendaciones</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Informe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {report.analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-500">Sesiones</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatNumber(report.analyticsData.sessionCount)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-green-500" />
                      <h3 className="text-sm font-medium text-gray-500">Usuarios</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatNumber(report.analyticsData.userCount)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointerClick className="h-5 w-5 text-purple-500" />
                      <h3 className="text-sm font-medium text-gray-500">Rebote</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatPercent(report.analyticsData.bounceRate)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <h3 className="text-sm font-medium text-gray-500">Tiempo medio</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatTime(report.analyticsData.avgSessionDuration)}</p>
                  </div>
                </div>
              )}
              
              {report.searchConsoleData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointerClick className="h-5 w-5 text-blue-500" />
                      <h3 className="text-sm font-medium text-gray-500">Clics</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatNumber(report.searchConsoleData.totalClicks)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-green-500" />
                      <h3 className="text-sm font-medium text-gray-500">Impresiones</h3>
                    </div>
                    <p className="text-2xl font-semibold">{formatNumber(report.searchConsoleData.totalImpressions)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-purple-500" />
                      <h3 className="text-sm font-medium text-gray-500">Posición media</h3>
                    </div>
                    <p className="text-2xl font-semibold">{report.searchConsoleData.avgPosition.toFixed(1)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {report.analyticsData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tráfico por fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={report.analyticsData.trafficBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="sessions"
                        nameKey="source"
                        label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                      >
                        {report.analyticsData.trafficBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} sesiones (${entry.percentage.toFixed(1)}%)`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {report.analyticsData && (
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Páginas más visitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.analyticsData.topPages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="path" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="Visitas" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Detalles de las páginas</h3>
                  <div className="space-y-3">
                    {report.analyticsData.topPages.map((page, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">{page.path}</p>
                          <p className="text-sm text-gray-500">Tiempo en página: {formatTime(page.avgTimeOnPage)}</p>
                        </div>
                        <Badge variant="outline">{formatNumber(page.views)} visitas</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {report.searchConsoleData && (
          <TabsContent value="searchconsole" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Palabras clave principales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.searchConsoleData.topQueries.map((query, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{query.query}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Posición {query.position.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Clics</p>
                          <p className="font-medium">{query.clicks}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Impresiones</p>
                          <p className="font-medium">{query.impressions}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">CTR</p>
                          <p className="font-medium">{query.ctr.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rendimiento en el tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      {day: 1, clicks: report.searchConsoleData.totalClicks * 0.7, impressions: report.searchConsoleData.totalImpressions * 0.7},
                      {day: 2, clicks: report.searchConsoleData.totalClicks * 0.75, impressions: report.searchConsoleData.totalImpressions * 0.75},
                      {day: 3, clicks: report.searchConsoleData.totalClicks * 0.8, impressions: report.searchConsoleData.totalImpressions * 0.8},
                      {day: 4, clicks: report.searchConsoleData.totalClicks * 0.85, impressions: report.searchConsoleData.totalImpressions * 0.85},
                      {day: 5, clicks: report.searchConsoleData.totalClicks * 0.9, impressions: report.searchConsoleData.totalImpressions * 0.9},
                      {day: 6, clicks: report.searchConsoleData.totalClicks * 0.95, impressions: report.searchConsoleData.totalImpressions * 0.95},
                      {day: 7, clicks: report.searchConsoleData.totalClicks, impressions: report.searchConsoleData.totalImpressions}
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="clicks" name="Clics" stroke="#4f46e5" />
                      <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impresiones" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recomendaciones para mejorar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-green-50">
                  <h3 className="font-medium text-green-800 mb-2">Optimización de contenido</h3>
                  <p className="text-green-700">Mejora la longitud y calidad del contenido en las páginas principales para aumentar su relevancia.</p>
                </div>
                
                <div className="p-4 border rounded-md bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-2">Palabras clave</h3>
                  <p className="text-blue-700">Optimiza el uso de palabras clave en títulos, meta descripciones y encabezados H1-H3.</p>
                </div>
                
                <div className="p-4 border rounded-md bg-purple-50">
                  <h3 className="font-medium text-purple-800 mb-2">Velocidad de carga</h3>
                  <p className="text-purple-700">Mejora la velocidad de carga optimizando imágenes y minimizando el uso de scripts pesados.</p>
                </div>
                
                <div className="p-4 border rounded-md bg-orange-50">
                  <h3 className="font-medium text-orange-800 mb-2">Experiencia de usuario</h3>
                  <p className="text-orange-700">Mejora la navegación y la estructura del sitio para reducir la tasa de rebote.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
