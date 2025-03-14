
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getClients } from "@/services/clientService";
import { getAllReports } from "@/services/reportService";
import { ClientReport, Client } from "@/types/client";
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  ArrowUp, 
  ArrowDown,
  ChevronRight 
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveUsers } from "@/components/dashboard/ActiveUsers";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UsageMetrics } from "@/components/dashboard/UsageMetrics";

const Index = () => {
  const [recentReports, setRecentReports] = useState<ClientReport[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [reports, loadedClients] = await Promise.all([
          getAllReports(),
          getClients()
        ]);
        
        setRecentReports(reports.slice(0, 5));
        setClients(loadedClients);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente desconocido";
  };

  // Calculate stats
  const totalClients = clients.length;
  const totalReports = recentReports.length;
  const clientsWithReports = new Set(recentReports.map(r => r.clientId)).size;
  const clientsPercentage = totalClients > 0 ? (clientsWithReports / totalClients) * 100 : 0;

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Ver Informes
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Análisis
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="h-32"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Clientes" 
            value={totalClients.toString()}
            change={"+7.5%"}
            trend="up"
            icon={<Users className="h-5 w-5 text-blue-500" />}
            color="bg-blue-100"
          />
          <StatCard 
            title="Informes" 
            value={totalReports.toString()}
            change={"+12.2%"}
            trend="up"
            icon={<FileText className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
          <StatCard 
            title="Propuestas" 
            value="8"
            change={"-2.4%"}
            trend="down"
            icon={<Activity className="h-5 w-5 text-red-500" />}
            color="bg-red-100"
          />
          <StatCard 
            title="Rendimiento" 
            value="89%"
            change={"+4.7%"}
            trend="up"
            icon={<BarChart3 className="h-5 w-5 text-purple-500" />}
            color="bg-purple-100"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Uso por Cliente</CardTitle>
            <CardDescription>
              Actividad y distribución de servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsageMetrics />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clientes Activos</CardTitle>
            <CardDescription>
              Últimos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActiveUsers clients={clients.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Informes Recientes</CardTitle>
              <CardDescription>
                Últimos informes generados
              </CardDescription>
            </div>
            <Link to="/reports">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No hay informes recientes</p>
                <Link to="/reports/new">
                  <Button variant="outline">Crear Nuevo Informe</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{getClientName(report.clientId)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {format(new Date(report.date), "d MMM yyyy", { locale: es })}
                      </span>
                      <Badge variant={report.type === 'seo' ? "default" : "outline"} className="font-normal">
                        {report.type}
                      </Badge>
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
