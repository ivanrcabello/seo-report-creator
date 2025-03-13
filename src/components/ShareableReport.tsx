
import { useState, useEffect } from "react";
import { ClientReport, AnalyticsData, SearchConsoleData } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
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
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Globe, 
  Search, 
  Activity, 
  Clock 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ShareableReportProps {
  report: ClientReport;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const ShareableReport = ({ report }: ShareableReportProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const renderStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'Válido') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (status === false || status === 'Inválido') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
  };

  // Transformar datos para gráficas
  const getTrafficSourceData = () => {
    return report.analyticsData?.trafficBySource || [];
  };

  const getTopQueriesData = () => {
    return report.searchConsoleData?.topQueries || [];
  };

  const getTopPagesData = () => {
    return report.analyticsData?.topPages.map(page => ({
      name: page.path,
      views: page.views
    })) || [];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
        <p className="opacity-90">Informe generado el {formatDate(report.date)}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="searchconsole" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            Search Console
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Recomendaciones
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Visibilidad Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {report.searchConsoleData ? `${Math.round(report.searchConsoleData.avgPosition)}` : "N/A"}
                  </div>
                  <p className="text-gray-600">Posición media en búsquedas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Tráfico Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {report.analyticsData ? report.analyticsData.sessionCount.toLocaleString('es-ES') : "N/A"}
                  </div>
                  <p className="text-gray-600">Sesiones últimos 30 días</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumen del informe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {report.url && (
                  <div>
                    <h3 className="font-medium mb-2">URL analizada</h3>
                    <Badge variant="outline" className="text-blue-700 bg-blue-50">
                      {report.url}
                    </Badge>
                  </div>
                )}
                
                {report.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Notas del informe</h3>
                    <p className="text-gray-700">{report.notes}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-2">Tipo de informe</h3>
                  <Badge variant="outline" className="capitalize bg-purple-50 text-purple-700">
                    {report.type === 'seo' ? 'SEO' : 
                     report.type === 'performance' ? 'Rendimiento' : 
                     report.type === 'technical' ? 'Técnico' : 
                     report.type === 'social' ? 'Social' : 
                     report.type === 'local-seo' ? 'SEO Local' : report.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {report.analyticsData && report.searchConsoleData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">CTR Medio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.searchConsoleData.avgCtr.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Impresiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {report.searchConsoleData.totalImpressions.toLocaleString('es-ES')}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Duración Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.floor(report.analyticsData.avgSessionDuration / 60)}m {report.analyticsData.avgSessionDuration % 60}s
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          {report.analyticsData ? (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Visión general de la audiencia
                  </CardTitle>
                  <CardDescription>
                    Periodo: {formatDate(report.analyticsData.timeRange.from)} - {formatDate(report.analyticsData.timeRange.to)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Usuarios</div>
                      <div className="text-2xl font-bold">{report.analyticsData.userCount.toLocaleString('es-ES')}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Páginas vistas</div>
                      <div className="text-2xl font-bold">{report.analyticsData.pageViews.toLocaleString('es-ES')}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Tasa de rebote</div>
                      <div className="text-2xl font-bold">{report.analyticsData.bounceRate.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Distribución de tráfico por fuente</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getTrafficSourceData()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="sessions"
                            nameKey="source"
                            label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                          >
                            {getTrafficSourceData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} sesiones`, 'Sesiones']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Páginas más visitadas</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getTopPagesData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toLocaleString()} vistas`, 'Vistas de página']} />
                          <Legend />
                          <Bar dataKey="views" name="Vistas de página" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No hay datos de Analytics disponibles</h3>
                <p className="text-gray-500 text-center max-w-md">
                  No se ha conectado la cuenta de Google Analytics o no hay datos para el periodo seleccionado.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="searchconsole">
          {report.searchConsoleData ? (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    Rendimiento en búsquedas
                  </CardTitle>
                  <CardDescription>
                    Periodo: {formatDate(report.searchConsoleData.timeRange.from)} - {formatDate(report.searchConsoleData.timeRange.to)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Clics</div>
                      <div className="text-2xl font-bold">{report.searchConsoleData.totalClicks.toLocaleString('es-ES')}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Impresiones</div>
                      <div className="text-2xl font-bold">{report.searchConsoleData.totalImpressions.toLocaleString('es-ES')}</div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">CTR</div>
                      <div className="text-2xl font-bold">{report.searchConsoleData.avgCtr.toFixed(2)}%</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Posición</div>
                      <div className="text-2xl font-bold">{report.searchConsoleData.avgPosition.toFixed(1)}</div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Palabras clave principales</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getTopQueriesData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="query" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="clicks" name="Clics" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="position" name="Posición (menor es mejor)" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Páginas principales</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            URL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clics
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Impresiones
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CTR
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posición
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.searchConsoleData.topPages.map((page, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {page.page}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.clicks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.impressions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.ctr.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.position.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No hay datos de Search Console disponibles</h3>
                <p className="text-gray-500 text-center max-w-md">
                  No se ha conectado la cuenta de Google Search Console o no hay datos para el periodo seleccionado.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones SEO</CardTitle>
              <CardDescription>
                Basadas en el análisis realizado, estas son nuestras recomendaciones para mejorar el rendimiento de tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Aspectos positivos
                  </h3>
                  <ul className="space-y-2 pl-7 list-disc">
                    <li>Buena estructura de URLs</li>
                    <li>Tiempo de carga adecuado en dispositivos móviles</li>
                    <li>Correcta implementación de etiquetas meta</li>
                    <li>Buena experiencia de usuario</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-amber-50">
                  <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    Puntos de mejora
                  </h3>
                  <ul className="space-y-2 pl-7 list-disc">
                    <li>Optimizar las imágenes para reducir su tamaño</li>
                    <li>Mejorar la densidad de palabras clave en contenidos</li>
                    <li>Aumentar la cantidad de enlaces internos</li>
                    <li>Implementar datos estructurados para mejorar los resultados enriquecidos</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5" />
                    Acciones prioritarias
                  </h3>
                  <ol className="space-y-4 pl-7 list-decimal">
                    <li>
                      <div className="font-medium">Optimizar el contenido de las páginas principales</div>
                      <p className="text-sm text-gray-600">Mejorar los títulos, descripciones y estructura de contenido para las palabras clave objetivo.</p>
                    </li>
                    <li>
                      <div className="font-medium">Mejorar la velocidad de carga</div>
                      <p className="text-sm text-gray-600">Comprimir imágenes, minificar CSS/JS y utilizar caching del navegador.</p>
                    </li>
                    <li>
                      <div className="font-medium">Mejorar la estrategia de enlaces</div>
                      <p className="text-sm text-gray-600">Crear más enlaces internos y trabajar en conseguir backlinks de calidad.</p>
                    </li>
                    <li>
                      <div className="font-medium">Optimizar para móviles</div>
                      <p className="text-sm text-gray-600">Asegurar que todas las páginas sean completamente responsive y funcionales en dispositivos móviles.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="px-8 py-4 bg-gray-50 border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Informe SEO Profesional | Compartido el {report.sharedAt ? formatDate(report.sharedAt) : format(new Date(), "d 'de' MMMM, yyyy", { locale: es })}
      </div>
    </div>
  );
};
