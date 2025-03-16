
import { useState, useEffect } from "react";
import { MetricsCard } from "./MetricsCard";
import { MapPin, Store, Award, Search, RefreshCcw, Globe, Phone, Star, PlusCircle, Save } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface LocalSeoMetricsProps {
  clientId: string;
  clientName: string;
}

// Form schema for quick metrics update
const localSeoMetricsSchema = z.object({
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
  
  // Setup form
  const form = useForm<LocalSeoMetricsFormValues>({
    resolver: zodResolver(localSeoMetricsSchema),
    defaultValues: {
      googleMapsRanking: 0,
      googleReviewsCount: 0,
      googleReviewsAverage: 0,
      listingsCount: 0,
    },
  });
  
  useEffect(() => {
    loadReports();
    loadSettings();
    loadMetricsHistory();
  }, [clientId]);
  
  useEffect(() => {
    // Update form values when settings load
    if (localSeoSettings) {
      form.reset({
        googleMapsRanking: localSeoSettings.google_maps_ranking || 0,
        googleReviewsCount: localSeoSettings.google_reviews_count || 0,
        googleReviewsAverage: localSeoSettings.google_reviews_average || 0,
        listingsCount: localSeoSettings.listings_count || 0,
      });
    }
  }, [localSeoSettings, form]);
  
  const loadReports = async () => {
    setIsLoading(true);
    try {
      const reports = await getLocalSeoReports(clientId);
      setLocalSeoReports(reports);
      
      if (reports.length > 0) {
        setCurrentReport(reports[0]);
      }
    } catch (error) {
      console.error("Error loading local SEO reports:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadSettings = async () => {
    try {
      const settings = await getLocalSeoSettings(clientId);
      setLocalSeoSettings(settings);
    } catch (error) {
      console.error("Error loading local SEO settings:", error);
    }
  };
  
  const loadMetricsHistory = async () => {
    try {
      const history = await getLocalSeoMetricsHistory(clientId);
      setMetricHistory(history);
    } catch (error) {
      console.error("Error loading local SEO metrics history:", error);
    }
  };
  
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadReports(), loadSettings(), loadMetricsHistory()]);
      toast.success("Datos de SEO Local actualizados");
    } catch (error) {
      console.error("Error refreshing local SEO data:", error);
      toast.error("Error al actualizar datos de SEO Local");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Save metrics function
  const onSubmit = async (data: LocalSeoMetricsFormValues) => {
    setIsSaving(true);
    try {
      // Use current settings as base and update with new metrics
      const settingsToSave = {
        id: localSeoSettings?.id,
        clientId: clientId,
        businessName: localSeoSettings?.business_name || clientName,
        address: localSeoSettings?.address || "",
        phone: localSeoSettings?.phone || null,
        website: localSeoSettings?.website || null,
        googleBusinessUrl: localSeoSettings?.google_business_url || null,
        targetLocations: localSeoSettings?.target_locations || [],
        googleMapsRanking: data.googleMapsRanking,
        googleReviewsCount: data.googleReviewsCount,
        googleReviewsAverage: data.googleReviewsAverage,
        listingsCount: data.listingsCount,
      };
      
      // Save to settings
      await saveLocalSeoSettings(settingsToSave);
      
      // Also save to historical metrics
      await saveLocalSeoMetrics(clientId, {
        googleMapsRanking: data.googleMapsRanking,
        googleReviewsCount: data.googleReviewsCount,
        googleReviewsAverage: data.googleReviewsAverage,
        listingsCount: data.listingsCount,
      });
      
      toast.success("Métricas SEO local guardadas correctamente");
      refreshData();
    } catch (error) {
      console.error("Error saving local SEO metrics:", error);
      toast.error("Error al guardar métricas de SEO Local");
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
  
  // If no data available
  if (!currentReport && !localSeoSettings) {
    return (
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
      >
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-seo-blue" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay información de SEO Local</h3>
          <p className="text-gray-600 mb-4">
            Configura los datos de SEO local del cliente desde la pestaña de SEO Local para ver las métricas.
          </p>
        </div>
      </MetricsCard>
    );
  }
  
  // Combine data from both sources, prioritizing the report data
  const businessName = currentReport?.businessName || localSeoSettings?.business_name || clientName;
  const location = currentReport?.location || localSeoSettings?.address || "Sin ubicación";
  const phone = currentReport?.phone || localSeoSettings?.phone;
  const website = currentReport?.website || localSeoSettings?.website;
  const googleBusinessUrl = currentReport?.googleBusinessUrl || localSeoSettings?.google_business_url;
  const targetLocations = localSeoSettings?.target_locations || [];
  const googleMapsRanking = currentReport?.googleMapsRanking || localSeoSettings?.google_maps_ranking || 0;
  const googleReviewsCount = currentReport?.googleReviewsCount || localSeoSettings?.google_reviews_count || 0;
  const googleReviewsAverage = localSeoSettings?.google_reviews_average || 0;
  const listingsCount = localSeoSettings?.listings_count || 0;
  
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
            <TabsTrigger value="metrics">Actualizar Métricas</TabsTrigger>
            {currentReport?.keywordRankings && currentReport.keywordRankings.length > 0 && (
              <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
            )}
            {metricHistory.length > 0 && (
              <TabsTrigger value="history">Historial</TabsTrigger>
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
                  <p className="text-gray-600">{location}</p>
                  
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
          
          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actualizar Métricas SEO Local</CardTitle>
                <CardDescription>
                  Mantén actualizadas las métricas de SEO local para este cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          Guardar Métricas
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="keywords">
            {currentReport?.keywordRankings && currentReport.keywordRankings.length > 0 && (
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
