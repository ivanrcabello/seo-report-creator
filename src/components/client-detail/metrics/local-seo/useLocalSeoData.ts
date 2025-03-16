
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  getLocalSeoReports, 
  getLocalSeoSettings, 
  getLocalSeoMetricsHistory,
  saveLocalSeoSettings,
  saveLocalSeoMetrics
} from "@/services/localSeo";
import { SeoLocalReport } from "@/types/client";
import * as z from "zod";

export const localSeoMetricsSchema = z.object({
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

export type LocalSeoMetricsFormValues = z.infer<typeof localSeoMetricsSchema>;

export const useLocalSeoData = (clientId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localSeoReports, setLocalSeoReports] = useState<SeoLocalReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SeoLocalReport | null>(null);
  const [localSeoSettings, setLocalSeoSettings] = useState<any>(null);
  const [metricHistory, setMetricHistory] = useState<any[]>([]);
  const [targetLocations, setTargetLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");

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

  const saveData = async (data: LocalSeoMetricsFormValues) => {
    if (!clientId || clientId.trim() === '') {
      toast.error("ID de cliente no válido");
      return;
    }
    
    setIsSaving(true);
    try {
      console.log("Saving Local SEO settings with data:", data);
      console.log("Target locations:", targetLocations);
      
      // Convertir valores a números adecuados
      const reviewsAvg = typeof data.googleReviewsAverage === 'number' ? 
        data.googleReviewsAverage : 
        (parseFloat(String(data.googleReviewsAverage)) || null);
      
      const reviewsCount = typeof data.googleReviewsCount === 'number' ?
        data.googleReviewsCount :
        (parseInt(String(data.googleReviewsCount)) || null);
      
      const listingsCount = typeof data.listingsCount === 'number' ?
        data.listingsCount :
        (parseInt(String(data.listingsCount)) || null);
      
      const mapsRanking = typeof data.googleMapsRanking === 'number' ?
        data.googleMapsRanking :
        (parseInt(String(data.googleMapsRanking)) || null);
      
      const settingsToSave = {
        id: localSeoSettings?.id,
        clientId: clientId,
        businessName: data.businessName,
        address: data.address,
        phone: data.phone || null,
        website: data.website || null,
        googleBusinessUrl: data.googleBusinessUrl || null,
        targetLocations: targetLocations,
        googleReviewsCount: reviewsCount,
        googleReviewsAverage: reviewsAvg,
        listingsCount: listingsCount,
        googleMapsRanking: mapsRanking,
      };
      
      console.log("Final settings data to save:", settingsToSave);
      
      // Intento guardar configuración
      const savedSettings = await saveLocalSeoSettings(settingsToSave);
      console.log("Settings saved successfully:", savedSettings);
      
      // También guardo las métricas por separado para asegurar que se registren
      if (data.googleMapsRanking !== undefined || 
          data.googleReviewsCount !== undefined || 
          data.googleReviewsAverage !== undefined || 
          data.listingsCount !== undefined) {
        
        try {
          console.log("Also saving metrics directly:", {
            googleMapsRanking: mapsRanking,
            googleReviewsCount: reviewsCount,
            googleReviewsAverage: reviewsAvg,
            listingsCount: listingsCount
          });
          
          const metricsResult = await saveLocalSeoMetrics(clientId, {
            googleMapsRanking: mapsRanking,
            googleReviewsCount: reviewsCount,
            googleReviewsAverage: reviewsAvg,
            listingsCount: listingsCount,
          });
          
          console.log("Metrics saved separately:", metricsResult);
        } catch (metricsError) {
          console.error("Error saving metrics separately:", metricsError);
          // Continue regardless of this error
        }
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

  return {
    isLoading,
    isRefreshing,
    isSaving,
    localSeoReports,
    currentReport,
    localSeoSettings,
    metricHistory,
    targetLocations,
    newLocation,
    setNewLocation,
    loadData,
    refreshData,
    handleAddLocation,
    handleRemoveLocation,
    handleKeyDown,
    saveData
  };
};
