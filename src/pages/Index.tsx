import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardSummary } from "@/components/DashboardSummary";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClients } from "@/services/clientService";
import { getAllReports } from "@/services/reportService";
import { ClientReport, Client } from "@/types/client";
import { CalendarRange, FileSpreadsheet, BarChart3, Activity, ChevronRight, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Index = () => {
  const [recentReports, setRecentReports] = useState<ClientReport[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Modify the useEffect blocks to properly handle async data
  useEffect(() => {
    const loadRecentReports = async () => {
      try {
        const reports = await getAllReports();
        setRecentReports(reports.slice(0, 5));
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };
    
    loadRecentReports();
  }, []);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const loadedClients = await getClients();
        setClients(loadedClients);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };
    
    loadClients();
  }, []);

  // Función para obtener el nombre del cliente por ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente desconocido";
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Informes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarRange className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardSummary />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Informes Recientes</h2>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Últimos informes generados</CardTitle>
                <CardDescription>
                  Revisa los últimos informes creados para tus clientes
                </CardDescription>
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
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm text-gray-600">{getClientName(report.clientId)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {format(new Date(report.date), "d MMM yyyy", { locale: es })}
                            </span>
                          </div>
                          <Badge variant="outline" className="font-normal">
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
              <CardFooter className="border-t pt-4">
                <Link to="/reports" className="w-full">
                  <Button variant="outline" className="w-full">Ver Todos los Informes</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Informes</CardTitle>
              <CardDescription>
                Gestiona todos los informes de tus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Contenido de la pestaña de informes...</p>
              <Link to="/reports">
                <Button>Ver Informes</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analíticas</CardTitle>
              <CardDescription>
                Visualiza estadísticas y métricas de rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido de la pestaña de analíticas...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendario</CardTitle>
              <CardDescription>
                Visualiza y gestiona eventos y fechas importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido de la pestaña de calendario...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
