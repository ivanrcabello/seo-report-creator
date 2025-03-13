
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Plus,
  ArrowRight,
  Globe,
  Search,
  Server,
  Share2
} from "lucide-react";
import { getClients, getReports } from "@/services/clientService";
import { ClientReport } from "@/types/client";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

type ReportTypeCount = {
  type: string;
  count: number;
  color: string;
};

const Dashboard = () => {
  const [clients, setClients] = useState(getClients());
  const [reports, setReports] = useState<ClientReport[]>(getReports());
  const [recentReports, setRecentReports] = useState<ClientReport[]>([]);
  const [reportsByType, setReportsByType] = useState<ReportTypeCount[]>([]);
  const [reportsByMonth, setReportsByMonth] = useState<any[]>([]);

  useEffect(() => {
    // Get recent reports (last 7)
    const sorted = [...reports].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 7);
    setRecentReports(sorted);

    // Count reports by type
    const typeColors = {
      seo: "#10b981",
      performance: "#8b5cf6",
      technical: "#3b82f6",
      social: "#f97316"
    };
    
    const counts: Record<string, number> = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const typeCounts = Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      color: typeColors[type as keyof typeof typeColors]
    }));
    
    setReportsByType(typeCounts);

    // Reports by month (last 6 months)
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        date: d
      };
    }).reverse();
    
    const reportCounts = last6Months.map(({ month, year, date }) => {
      const startOfMonth = new Date(date);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = reports.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= startOfMonth && reportDate <= endOfMonth;
      }).length;
      
      return {
        name: `${month} ${year}`,
        informes: count
      };
    });
    
    setReportsByMonth(reportCounts);
  }, [reports]);

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'seo': return 'SEO';
      case 'performance': return 'Rendimiento';
      case 'technical': return 'Técnico';
      case 'social': return 'Social';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seo':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      case 'technical':
        return <Server className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Share2 className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Clientes</p>
                <h3 className="text-3xl font-bold mt-1">{clients.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/clients">
                <Button variant="ghost" size="sm" className="gap-1 text-blue-600 pl-0 hover:pl-2 transition-all">
                  Ver clientes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Informes</p>
                <h3 className="text-3xl font-bold mt-1">{reports.length}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports">
                <Button variant="ghost" size="sm" className="gap-1 text-purple-600 pl-0 hover:pl-2 transition-all">
                  Ver informes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Informes este mes</p>
                <h3 className="text-3xl font-bold mt-1">
                  {reports.filter(r => {
                    const reportDate = new Date(r.date);
                    const now = new Date();
                    return reportDate.getMonth() === now.getMonth() && 
                           reportDate.getFullYear() === now.getFullYear();
                  }).length}
                </h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/reports/new">
                <Button variant="ghost" size="sm" className="gap-1 text-green-600 pl-0 hover:pl-2 transition-all">
                  Nuevo informe
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Último informe</p>
                <h3 className="text-xl font-bold mt-1">
                  {reports.length > 0 ? 
                    format(new Date(
                      [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date
                    ), "d MMM yyyy", { locale: es }) : 
                    "Sin informes"}
                </h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              {reports.length > 0 ? (
                <Link to={`/reports/${
                  [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.id
                }`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-amber-600 pl-0 hover:pl-2 transition-all">
                    Ver último
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <span className="text-sm text-gray-500">Sin actividad reciente</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informes recientes</CardTitle>
            <CardDescription>Últimos informes creados para clientes</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No hay informes disponibles</p>
                <Link to="/reports/new">
                  <Button variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Crear Primer Informe
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => {
                  const client = clients.find(c => c.id === report.clientId);
                  return (
                    <div key={report.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">{client?.name}</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                              {getTypeLabel(report.type)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(report.date), "d MMM yyyy", { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/reports" className="w-full">
              <Button variant="outline" className="w-full gap-1">
                Ver todos los informes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Reports by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por tipo</CardTitle>
            <CardDescription>Informes por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            {reportsByType.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, count }) => `${getTypeLabel(type)}: ${count}`}
                    >
                      {reportsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, getTypeLabel(name as string)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-6 space-y-3">
              {reportsByType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{getTypeLabel(item.type)}</span>
                  </div>
                  <div className="text-sm font-medium">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Reports Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Informes por mes</CardTitle>
            <CardDescription>Evolución de la creación de informes en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsByMonth}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="informes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients with PDF upload section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Análisis de posicionamiento web
            </CardTitle>
            <CardDescription>
              Analiza la posición web de tus clientes subiendo archivos PDF o realizando auditorías en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-between p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div>
                  <h3 className="text-lg font-medium mb-2">Análisis con PDF</h3>
                  <p className="text-gray-600 mb-4">
                    Sube informes de auditoría en PDF para generar análisis detallados y recomendaciones
                  </p>
                </div>
                <Link to="/">
                  <Button className="w-full">Subir PDF para análisis</Button>
                </Link>
              </div>
              
              <div className="flex flex-col justify-between p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div>
                  <h3 className="text-lg font-medium mb-2">Gestión de clientes</h3>
                  <p className="text-gray-600 mb-4">
                    Selecciona un cliente para realizar o ver sus informes de auditoría
                  </p>
                </div>
                <Link to="/clients">
                  <Button className="w-full" variant="outline">Ver clientes</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
