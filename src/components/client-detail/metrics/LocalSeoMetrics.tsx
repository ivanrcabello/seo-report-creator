import { useState, useEffect } from "react";
import { MetricsCard } from "./MetricsCard";
import { MapPin, Store, Award, Search, RefreshCcw, Globe, Phone, Star, Save } from "lucide-react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SeoLocalReport } from "@/types/client";
import { 
  getLocalSeoReports, 
  getLocalSeoSettings, 
  saveLocalSeoSettings, 
  getLocalSeoMetricsHistory,
  saveLocalSeoMetrics
} from "@/services/localSeoService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LocalSeoMetricsProps {
  clientId: string;
  clientName: string;
}

const localSeoMetricsSchema = z.object({
  businessName: z.string().min(1, "El nombre del negocio es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  phone: z.string().optional(),
  website: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  googleMapsRanking: z.coerce.number().min(0).max(100).optional(),
  googleReviewsCount: z.coerce.number().min(0).optional(),
  googleReviewsAverage: z.coerce.number().min(0).max(5).optional(),
  listingsCount: z.coerce.number().min(0).optional(),
});

type LocalSeoMetricsFormValues = z.infer<typeof localSeoMetricsSchema>;

export const LocalSeoMetrics = ({ clientId, clientName }: LocalSeoMetricsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SeoLocalReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSeoSettings, setLocalSeoSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [metricHistory, setMetricHistory] = useState<any[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [targetLocations, setTargetLocations] = useState<string[]>([]);
  
  const form = useForm<LocalSeoMetricsFormValues>({
    resolver: zodResolver(localSeoMetricsSchema),
    defaultValues: {
      businessName: clientName,
      address: "",
      phone: "",
      website: "",
      googleBusinessUrl: "",
      googleMapsRanking: 0,
      googleReviewsCount: 0,
      googleReviewsAverage: 0,
      listingsCount: 0,
    },
  });
  
  useEffect(() => {
    if (clientId) {
      console.log("Loading Local SEO data for client:", clientId);
      loadData();
    }
  }, [clientId]);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadReports(),
        loadSettings(),
        loadMetricsHistory()
      ]);
    } catch (error) {
      console.error("Error loading Local SEO data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadReports = async () => {
    try {
      console.log("Loading Local SEO reports for client:", clientId);
      const reports = await getLocalSeoReports(clientId);
      console.log("Local SEO reports loaded:", reports);
      setLocalSeoReports(reports);
      
      if (reports.length > 0) {
        setCurrentReport(reports[0]);
      }
    } catch (error) {
      console.error("Error loading local SEO reports:", error);
    }
  };
  
  const loadSettings = async () => {
    try {
      console.log("Loading Local SEO settings for client:", clientId);
      const settings = await getLocalSeoSettings(clientId);
      console.log("Local SEO settings loaded:", settings);
      
      setLocalSeoSettings(settings);
      
      if (settings) {
        setTargetLocations(settings.target_locations || []);
        
        form.reset({
          businessName: settings.business_name || clientName,
          address: settings.address || "",
          phone: settings.phone || "",
          website: settings.website || "",
          googleBusinessUrl: settings.google_business_url || "",
          googleMapsRanking: settings.google_maps_ranking || 0,
          googleReviewsCount: settings.google_reviews_count || 0,
          googleReviewsAverage: settings.google_reviews_average || 0,
          listingsCount: settings.listings_count || 0,
        });
      } else {
        form.reset({
          businessName: clientName,
          address: "",
          phone: "",
          website: "",
          googleBusinessUrl: "",
          googleMapsRanking: 0,
          googleReviewsCount: 0,
          googleReviewsAverage: 0,
          listingsCount: 0,
        });
      }
    } catch (error) {
      console.error("Error loading local SEO settings:", error);
    }
  };
  
  const loadMetricsHistory = async () => {
    try {
      console.log("Loading Local SEO metrics history for client:", clientId);
      const history = await getLocalSeoMetricsHistory(clientId);
      console.log("Local SEO metrics history loaded:", history);
      setMetricHistory(history);
    } catch (error) {
      console.error("Error loading local SEO metrics history:", error);
    }
  };
  
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      toast.success("Datos de SEO Local actualizados correctamente");
    } catch (error) {
      console.error("Error refreshing local SEO data:", error);
      toast.error("Error al actualizar datos de SEO Local");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    
    if (!targetLocations.includes(newLocation.trim())) {
      setTargetLocations(prev => [...prev, newLocation.trim()]);
    }
    
    setNewLocation("");
  };
  
  const handleRemoveLocation = (location: string) => {
    setTargetLocations(prev => prev.filter(loc => loc !== location));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation();
    }
  };
  
  const onSubmit = async (data: LocalSeoMetricsFormValues) => {
    if (!clientId || clientId.trim() === '') {
      toast.error("ID de cliente no válido");
      return;
    }
    
    setIsSaving(true);
    try {
      console.log("Saving Local SEO settings with data:", data);
      console.log("Target locations:", targetLocations);
      
      const settingsToSave = {
        id: localSeoSettings?.id,
        clientId: clientId,
        businessName: data.businessName,
        address: data.address,
        phone: data.phone,
        website: data.website,
        googleBusinessUrl: data.googleBusinessUrl,
        targetLocations: targetLocations,
        googleMapsRanking: data.googleMapsRanking,
        googleReviewsCount: data.googleReviewsCount,
        googleReviewsAverage: data.googleReviewsAverage,
        listingsCount: data.listingsCount,
      };
      
      console.log("Final data to save:", settingsToSave);
      
      const savedSettings = await saveLocalSeoSettings(settingsToSave);
      console.log("Settings saved successfully:", savedSettings);
      
      if (data.googleMapsRanking || data.googleReviewsCount || data.googleReviewsAverage || data.listingsCount) {
        const metricsResult = await saveLocalSeoMetrics(clientId, {
          googleMapsRanking: data.googleMapsRanking,
          googleReviewsCount: data.googleReviewsCount,
          googleReviewsAverage: data.googleReviewsAverage,
          listingsCount: data.listingsCount,
        });
        console.log("Metrics history saved:", metricsResult);
      }
      
      toast.success("Configuración de SEO local guardada correctamente");
      await loadData();
    } catch (error) {
      console.error("Error saving local SEO settings:", error);
      toast.error("Error al guardar la configuración de SEO Local");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
      >
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </MetricsCard>
    );
  }
  
  const businessName = form.watch("businessName") || clientName;
  const address = form.watch("address") || "Sin ubicación configurada";
  const phone = form.watch("phone");
  const website = form.watch("website");
  const googleBusinessUrl = form.watch("googleBusinessUrl");
  const googleMapsRanking = form.watch("googleMapsRanking") || 0;
  const googleReviewsCount = form.watch("googleReviewsCount") || 0;
  const googleReviewsAverage = form.watch("googleReviewsAverage") || 0;
  const listingsCount = form.watch("listingsCount") || 0;
  
  return (
    <>
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
        action={
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      >
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visión General</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            {metricHistory.length > 0 && (
              <TabsTrigger value="history">Historial</TabsTrigger>
            )}
            {currentReport?.keywordRankings && currentReport.keywordRankings.length > 0 && (
              <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Negocio
                  </h3>
                  <p className="text-lg font-semibold">{businessName}</p>
                  <p className="text-gray-600">{address}</p>
                  
                  <div className="mt-3 space-y-1">
                    {phone && (
                      <p className="text-gray-600 text-sm flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {phone}
                      </p>
                    )}
                    
                    {website && (
                      <p className="text-gray-600 text-sm flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-gray-400" />
                        <a href={website.startsWith('http') ? website : `https://${website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[180px]">
                          {website.replace(/^https?:\/\//, '')}
                        </a>
                      </p>
                    )}
                    
                    {googleBusinessUrl && (
                      <p className="text-gray-600 text-sm flex items-center gap-1.5">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_My_Business_Logo.svg/512px-Google_My_Business_Logo.svg.png" 
                          alt="Google My Business" 
                          className="h-3.5 w-3.5" 
                        />
                        <a href={googleBusinessUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline">
                          Perfil de Google Business
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Google Maps
                    </h3>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-seo-blue">
                        #{googleMapsRanking || "N/A"}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Posición</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Reseñas
                    </h3>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-amber-500">
                        {googleReviewsCount || "0"}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Total</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Puntuación
                    </h3>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-500 mr-1">
                          {googleReviewsAverage?.toFixed(1) || "0.0"}
                        </span>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Promedio</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Directorios
                    </h3>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-indigo-500">
                        {listingsCount || "0"}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Listados</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {targetLocations && targetLocations.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicaciones objetivo
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {targetLocations.map((location: string, index: number) => (
                      <Badge key={index} variant="outline" className="py-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {currentReport?.recommendations && currentReport.recommendations.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Recomendaciones
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {currentReport.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración SEO Local</CardTitle>
                <CardDescription>
                  Configura la información de tu negocio para SEO local y actualiza sus métricas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Informaci��n básica del negocio</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre del negocio</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Nombre del negocio o empresa"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dirección principal</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Dirección completa del negocio"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Teléfono del negocio"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sitio web</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="URL del sitio web"
                                    type="url"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="googleBusinessUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Perfil de Google My Business</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="URL del perfil de Google My Business"
                                    type="url"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 border-t pt-4">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          Ubicaciones objetivo para SEO local
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {targetLocations.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No hay ubicaciones configuradas</p>
                          ) : (
                            targetLocations.map((location, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1 py-1.5">
                                <MapPin className="h-3 w-3" />
                                {location}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 ml-1 rounded-full"
                                  onClick={() => handleRemoveLocation(location)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Eliminar</span>
                                </Button>
                              </Badge>
                            ))
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Añadir nueva ubicación (ej: Madrid, Barcelona, etc.)"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddLocation}
                            variant="outline"
                            size="icon"
                            disabled={!newLocation.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 border-t pt-4">
                        <h3 className="text-sm font-medium">Métricas actuales de SEO local</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="googleMapsRanking"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Posición en Google Maps</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    placeholder="Ej: 3" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="googleReviewsCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Reseñas en Google</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    placeholder="Ej: 25" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="googleReviewsAverage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Puntuación Media (0-5)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    placeholder="Ej: 4.5" 
                                    step="0.1"
                                    min="0"
                                    max="5"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="listingsCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Directorios</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    placeholder="Ej: 10" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar configuración
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="keywords">
            {currentReport?.keywordRankings && currentReport.keywordRankings.length > 0 ? (
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Palabras Clave Locales
                </h3>
                <div className="space-y-4">
                  {currentReport.keywordRankings.map((kw: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{kw.keyword}</span>
                        <span className={
                          kw.position <= 3 ? "text-green-600 font-semibold" : 
                          kw.position <= 10 ? "text-amber-600 font-semibold" : 
                          "text-gray-600"
                        }>
                          {kw.position === 0 ? "No posicionada" : `#${kw.position}`}
                        </span>
                      </div>
                      <Progress value={kw.position === 0 ? 0 : Math.max(5, 100 - (kw.position * 5))} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No hay datos de palabras clave disponibles.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {metricHistory.length > 0 ? (
              <div className="bg-white rounded-lg p-4 border">
                <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Historial de Métricas
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pos. Maps
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reseñas
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntuación
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Directorios
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {metricHistory.map((metric: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(metric.date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{metric.google_maps_ranking || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {metric.google_reviews_count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {metric.google_reviews_average?.toFixed(1) || '0.0'} <Star className="inline h-3 w-3 text-amber-500 fill-amber-500" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {metric.listings_count || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">No hay datos históricos disponibles aún.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </MetricsCard>
    </>
  );
};
