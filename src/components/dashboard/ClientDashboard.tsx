import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectTimeline } from "./ProjectTimeline";
import { SeoPerformanceCharts } from "./SeoPerformanceCharts";
import { DocumentCenter } from "./DocumentCenter";
import { UserProfile } from "./UserProfile";
import { SupportTickets } from "./SupportTickets";
import { ClientInvoicesWidget } from "./ClientInvoicesWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, TrendingUp, MessageSquare, User, FileText, FileSpreadsheet, FileSignature, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { ClientMetric, getClientMetrics } from "@/services/clientMetricsService";
import { ClientReports } from "@/components/ClientReports";
import { ClientProposals } from "@/components/ClientProposals";
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";

export function ClientDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ClientMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Su Empresa");

  useEffect(() => {
    if (!user) return;

    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch most recent metrics using the dedicated service
        if (user?.id) {
          try {
            const metricsData = await getClientMetrics(user.id);
            console.log("Client metrics fetched:", metricsData);
            
            if (metricsData && metricsData.length > 0) {
              setMetrics(metricsData[0]);
            } else {
              // Set default metrics if none exist
              setMetrics({
                id: "",
                month: new Date().toISOString().substring(0, 7),
                web_visits: 35,
                keywords_top10: 18,
                conversions: 22,
                conversion_goal: 30
              });
            }
          } catch (error) {
            console.error("Error fetching client metrics:", error);
            toast.error("No se pudieron cargar las métricas. Por favor, inténtalo de nuevo más tarde.");
            
            // Set default metrics on error
            setMetrics({
              id: "",
              month: new Date().toISOString().substring(0, 7),
              web_visits: 35,
              keywords_top10: 18,
              conversions: 22,
              conversion_goal: 30
            });
          }
        }
        
        // Fetch client profile to get company name
        try {
          const { data: profileData } = await supabase
            .from('clients')
            .select('company')
            .eq('id', user.id)
            .single();
          
          if (profileData?.company) {
            setCompanyName(profileData.company);
          }
        } catch (error) {
          console.error("Error fetching client profile:", error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [user]);

  if (isLoading) {
    return <div className="py-8 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard del Cliente: {companyName}</h1>
        <p className="text-gray-500">Resumen de rendimiento SEO y actividades</p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Informes
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex items-center gap-1">
            <MailOpen className="h-4 w-4" />
            Propuestas
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-1">
            <FileSignature className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Facturas
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Soporte
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {metrics && (
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
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProjectTimeline />
            </div>
            <ClientInvoicesWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SeoPerformanceCharts />
            </div>
            <DocumentCenter />
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          {user?.id && <ClientReports clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="proposals">
          {user?.id && <ClientProposals clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="contracts">
          {user?.id && <ClientContractsTab clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="invoices">
          {user?.id && <ClientInvoicesTab clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentCenter />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportTickets />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
