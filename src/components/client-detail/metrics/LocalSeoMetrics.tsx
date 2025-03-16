
import { useState, useEffect } from "react";
import { MetricsCard } from "./MetricsCard";
import { MapPin, Store, Award, Search, RefreshCcw, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SeoLocalReport } from "@/types/client";
import { getLocalSeoReports, getLocalSeoSettings } from "@/services/localSeoService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface LocalSeoMetricsProps {
  clientId: string;
  clientName: string;
}

export const LocalSeoMetrics = ({ clientId, clientName }: LocalSeoMetricsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SeoLocalReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSeoSettings, setLocalSeoSettings] = useState<any>(null);
  
  useEffect(() => {
    loadReports();
    loadSettings();
  }, [clientId]);
  
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
      toast.error("Error al cargar informes de SEO Local");
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
  
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadReports(), loadSettings()]);
      toast.success("Datos de SEO Local actualizados");
    } catch (error) {
      console.error("Error refreshing local SEO data:", error);
    } finally {
      setIsRefreshing(false);
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
            
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Google Maps
              </h3>
              {currentReport?.googleMapsRanking ? (
                <div className="text-center">
                  <span className="text-3xl font-bold text-seo-blue">
                    #{currentReport.googleMapsRanking}
                  </span>
                  <p className="text-gray-600 mt-1">Posición en Google Maps</p>
                </div>
              ) : (
                <p className="text-gray-600 italic">No hay datos de ranking en Google Maps</p>
              )}
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
      </MetricsCard>
    </>
  );
};
