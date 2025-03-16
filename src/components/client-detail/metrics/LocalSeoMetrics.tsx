
import { useState, useEffect } from "react";
import { MetricsCard } from "./MetricsCard";
import { MapPin, Store, Award, Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SeoLocalReport } from "@/types/client";
import { getLocalSeoReports } from "@/services/localSeoService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface LocalSeoMetricsProps {
  clientId: string;
  clientName: string;
}

export const LocalSeoMetrics = ({ clientId, clientName }: LocalSeoMetricsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SeoLocalReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    loadReports();
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
  
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadReports();
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
  
  if (!currentReport) {
    return (
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
      >
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-seo-blue" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay informes de SEO Local</h3>
          <p className="text-gray-600 mb-4">
            Genera un informe desde la sección de documentos para ver el rendimiento en búsquedas locales.
          </p>
        </div>
      </MetricsCard>
    );
  }
  
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
              <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                <Store className="h-4 w-4" />
                Negocio
              </h3>
              <p className="text-lg font-semibold">{currentReport.businessName}</p>
              <p className="text-gray-600">{currentReport.location}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Google Maps
              </h3>
              {currentReport.googleMapsRanking ? (
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
          
          {currentReport.keywordRankings && currentReport.keywordRankings.length > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Palabras Clave Locales
              </h3>
              <div className="space-y-4">
                {currentReport.keywordRankings.map((kw, index) => (
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
          
          {currentReport.recommendations && currentReport.recommendations.length > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Recomendaciones
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {currentReport.recommendations.map((rec, index) => (
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
