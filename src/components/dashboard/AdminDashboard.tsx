
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, Activity, FileText, Settings, PlusCircle, ArrowRight, Mail, Phone, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientSummary {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  created_at: string;
  lastActivity?: string;
}

export function AdminDashboard() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [recentClients, setRecentClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    newClientsThisMonth: 0,
    totalReports: 0,
    activeProposals: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all clients
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching clients:", error);
          return;
        }
        
        const formattedClients = data as ClientSummary[];
        setClients(formattedClients);
        setRecentClients(formattedClients.slice(0, 5));
        
        // Calculate metrics
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const newClientsCount = formattedClients.filter(client => {
          const createdAt = new Date(client.created_at);
          return createdAt >= firstDayOfMonth;
        }).length;
        
        setMetrics({
          totalClients: formattedClients.length,
          newClientsThisMonth: newClientsCount,
          totalReports: 24, // This would be replaced with actual data from reports table
          activeProposals: 7  // This would be replaced with actual data from proposals table
        });
      } catch (error) {
        console.error("Error in clients fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona clientes, informes y más</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleOpenSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
          <Button onClick={handleAddClient}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalClients}</div>
            <div className="text-sm text-gray-500 mt-1">
              <Badge className="bg-green-100 text-green-700">
                +{metrics.newClientsThisMonth} este mes
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-500" />
              Informes Generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalReports}</div>
            <div className="text-sm text-gray-500 mt-1">
              <Badge className="bg-purple-100 text-purple-700">
                +8 este mes
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-500" />
              Propuestas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeProposals}</div>
            <div className="text-sm text-gray-500 mt-1">
              <Badge className="bg-orange-100 text-orange-700">
                3 pendientes de revisión
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Clientes Recientes</CardTitle>
              <CardDescription>
                Últimos clientes añadidos a la plataforma
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/clients">
                Ver todos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Cargando clientes...</div>
            ) : recentClients.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay clientes disponibles</div>
            ) : (
              <div className="space-y-4">
                {recentClients.map(client => (
                  <div key={client.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {client.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{client.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </div>
                        )}
                        {client.company && (
                          <div className="text-sm text-gray-500">
                            {client.company}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(client.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/clients/${client.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en la plataforma
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/reports">
                Ver todo
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">
                        {i === 1 
                          ? "Nuevo informe SEO" 
                          : i === 2 
                          ? "Propuesta enviada" 
                          : i === 3 
                          ? "Nuevo cliente registrado" 
                          : i === 4 
                          ? "Factura pagada" 
                          : "Informe actualizado"}
                      </span>
                      <span className="text-gray-500">
                        {i === 1 
                          ? " para Empresa ABC" 
                          : i === 2 
                          ? " a Cliente XYZ" 
                          : i === 3 
                          ? ": Marketing Digital SL" 
                          : i === 4 
                          ? ": #INV-2024-06" 
                          : ": Optimización Local SEO"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {i === 1 
                        ? "Hace 2 horas" 
                        : i === 2 
                        ? "Ayer a las 18:30" 
                        : i === 3 
                        ? "Hace 2 días" 
                        : i === 4 
                        ? "23 de junio, 2024" 
                        : "24 de junio, 2024"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
