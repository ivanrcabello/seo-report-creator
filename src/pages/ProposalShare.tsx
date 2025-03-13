
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Proposal, ClientReport, Client, SeoPack } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareableReport } from "@/components/ShareableReport";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Package, 
  CheckCircle, 
  User, 
  Calendar, 
  Clock, 
  FileText,
  Check,
  Award
} from "lucide-react";

const ProposalShare = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [pack, setPack] = useState<SeoPack | null>(null);
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [activeTab, setActiveTab] = useState("proposal");
  const [loading, setLoading] = useState(true);
  
  // En una implementación real, esto cargaría datos desde API
  useEffect(() => {
    const loadProposal = async () => {
      try {
        // Aquí se cargarían los datos reales desde la API
        // Simulamos con un timeout
        setTimeout(() => {
          // Datos de prueba
          const mockProposal: Proposal = {
            id: "101",
            clientId: "1",
            title: "Propuesta SEO para Empresa Tecnológica ABC",
            description: "Estrategia de posicionamiento web personalizada para mejorar la visibilidad online de Tecnológica ABC S.L.",
            packId: "2",
            status: "sent",
            createdAt: "2024-03-10T11:30:00Z",
            updatedAt: "2024-03-10T15:45:00Z",
            sentAt: "2024-03-10T15:45:00Z",
            expiresAt: "2024-04-10T23:59:59Z",
            reportIds: ["report1"]
          };
          
          const mockClient: Client = {
            id: "1",
            name: "Empresa Tecnológica ABC",
            email: "contacto@empresaabc.com",
            company: "Tecnológica ABC S.L.",
            phone: "912345678",
            createdAt: "2024-01-15T10:00:00Z",
            analyticsConnected: true,
            searchConsoleConnected: true
          };
          
          const mockPack: SeoPack = {
            id: "2",
            name: "SEO Profesional",
            description: "Estrategia SEO completa para empresas en crecimiento",
            price: 599.99,
            features: [
              "Análisis SEO completo",
              "Optimización de 15 palabras clave",
              "Informes quincenales de rendimiento",
              "Optimización on-page avanzada",
              "Estrategia de contenidos básica",
              "Análisis de competencia"
            ],
            isActive: true,
            createdAt: "2024-01-20T14:30:00Z"
          };
          
          const mockReports: ClientReport[] = [
            {
              id: "report1",
              clientId: "1",
              title: "Análisis SEO inicial - Empresa Tecnológica ABC",
              date: "2024-03-05T10:00:00Z",
              type: "seo",
              url: "https://empresaabc.com",
              notes: "Informe inicial para evaluar la situación actual de la web",
              shareToken: "abc123",
              sharedAt: "2024-03-10T15:45:00Z",
              analyticsData: {
                sessionCount: 5423,
                userCount: 3801,
                pageViews: 12500,
                bounceRate: 62.4,
                avgSessionDuration: 145,
                topPages: [
                  {
                    path: "/",
                    views: 3200,
                    avgTimeOnPage: 85
                  },
                  {
                    path: "/productos",
                    views: 1850,
                    avgTimeOnPage: 130
                  },
                  {
                    path: "/contacto",
                    views: 980,
                    avgTimeOnPage: 75
                  }
                ],
                trafficBySource: [
                  {
                    source: "Organic Search",
                    sessions: 2100,
                    percentage: 38.7
                  },
                  {
                    source: "Direct",
                    sessions: 1500,
                    percentage: 27.6
                  },
                  {
                    source: "Referral",
                    sessions: 950,
                    percentage: 17.5
                  },
                  {
                    source: "Social",
                    sessions: 650,
                    percentage: 12
                  }
                ],
                conversionRate: 3.2,
                timeRange: {
                  from: "2024-02-05T00:00:00Z",
                  to: "2024-03-05T23:59:59Z"
                }
              },
              searchConsoleData: {
                totalClicks: 1850,
                totalImpressions: 45000,
                avgCtr: 4.1,
                avgPosition: 22.5,
                topQueries: [
                  {
                    query: "empresa tecnológica madrid",
                    clicks: 210,
                    impressions: 3500,
                    ctr: 6.0,
                    position: 8.2
                  },
                  {
                    query: "servicios tecnológicos empresa",
                    clicks: 185,
                    impressions: 2800,
                    ctr: 6.6,
                    position: 9.1
                  },
                  {
                    query: "tecnología empresarial",
                    clicks: 120,
                    impressions: 2500,
                    ctr: 4.8,
                    position: 12.3
                  }
                ],
                topPages: [
                  {
                    page: "/",
                    clicks: 450,
                    impressions: 12000,
                    ctr: 3.8,
                    position: 18.5
                  },
                  {
                    page: "/servicios",
                    clicks: 380,
                    impressions: 8500,
                    ctr: 4.5,
                    position: 15.2
                  },
                  {
                    page: "/productos/software",
                    clicks: 280,
                    impressions: 5200,
                    ctr: 5.4,
                    position: 12.8
                  }
                ],
                timeRange: {
                  from: "2024-02-05T00:00:00Z",
                  to: "2024-03-05T23:59:59Z"
                }
              }
            }
          ];
          
          setProposal(mockProposal);
          setClient(mockClient);
          setPack(mockPack);
          setReports(mockReports);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading proposal:", error);
        setLoading(false);
      }
    };
    
    loadProposal();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Cargando propuesta...</h2>
        </div>
      </div>
    );
  }
  
  if (!proposal || !client || !pack) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Propuesta no encontrada</CardTitle>
            <CardDescription>La propuesta no existe o no está disponible para visualización.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/">Volver al inicio</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
              <p className="text-blue-100">Propuesta enviada el {formatDate(proposal.sentAt || proposal.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm">
                Para: {client.name}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="proposal" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              Nuestra Propuesta
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Informe SEO
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposal" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Propuesta de servicios SEO</CardTitle>
                <CardDescription className="text-base">{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{client.company}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Validez de la oferta</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Enviada: {formatDate(proposal.sentAt || proposal.createdAt)}</span>
                      </div>
                      {proposal.expiresAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Válida hasta: {formatDate(proposal.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="rounded-xl border p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Package className="h-6 w-6 text-purple-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-900">{pack.name}</h3>
                        <p className="text-sm text-purple-700">Paquete recomendado</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <div className="text-3xl font-bold text-purple-900">
                        {(proposal.customPrice || pack.price).toFixed(2)} €
                      </div>
                      <p className="text-xs text-right text-purple-700">IVA incluido</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{pack.description}</p>
                  
                  <h4 className="font-medium text-purple-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Servicios incluidos
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(proposal.customFeatures || pack.features).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-lg shadow-sm">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
                  <h3 className="font-medium text-gray-900">¿Por qué elegirnos?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Experiencia probada</p>
                        <p className="text-sm text-gray-600">Más de 5 años de experiencia en SEO y posicionamiento web</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Resultados garantizados</p>
                        <p className="text-sm text-gray-600">Mejora de posicionamiento visible desde el primer mes</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Informes detallados</p>
                        <p className="text-sm text-gray-600">Seguimiento completo con informes quincenales de progreso</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Soporte personalizado</p>
                        <p className="text-sm text-gray-600">Atención directa con nuestros especialistas SEO</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg w-full">
                  <p>Si tiene preguntas sobre esta propuesta, contáctenos en nuestro email o teléfono de soporte.</p>
                </div>
                <Button className="w-full" size="lg">Aceptar propuesta</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="report">
            {reports.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Informe SEO</CardTitle>
                    <CardDescription>
                      Hemos realizado un análisis inicial de su sitio web para detectar oportunidades de mejora
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ShareableReport report={reports[0]} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No hay informes disponibles</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Esta propuesta no incluye ningún informe previo. Solicite un análisis SEO completo para obtener un informe detallado.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Servicio de Análisis SEO | Esta propuesta es confidencial</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalShare;
