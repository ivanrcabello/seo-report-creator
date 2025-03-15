
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ClientMetric, getClientMetrics, updateClientMetrics } from "@/services/clientMetricsService";

export const useClientMetrics = (clientId: string) => {
  const [metrics, setMetrics] = useState<ClientMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMetric, setCurrentMetric] = useState<ClientMetric | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching metrics for client ID:", clientId);
      
      const data = await getClientMetrics(clientId);
      console.log("Metrics data received:", data);
      
      setMetrics(data);
      
      if (data.length > 0) {
        setCurrentMetric(data[0]);
      } else {
        const today = new Date();
        const defaultMonth = format(today, 'yyyy-MM');
        
        const newMetric = {
          id: "",
          month: defaultMonth,
          web_visits: 0,
          keywords_top10: 0,
          conversions: 0,
          conversion_goal: 30
        };
        setCurrentMetric(newMetric);
      }
    } catch (error) {
      console.error("Error fetching client metrics:", error);
      const errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las métricas del cliente";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMetrics = async () => {
    if (!currentMetric) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      if (currentMetric.month.trim() === '') {
        throw new Error("El mes es obligatorio");
      }
      
      console.log("Saving metric for client ID:", clientId);
      console.log("Current metric data:", currentMetric);
      
      const metricToSave = {
        ...currentMetric,
        web_visits: Number(currentMetric.web_visits) || 0,
        keywords_top10: Number(currentMetric.keywords_top10) || 0,
        conversions: Number(currentMetric.conversions) || 0,
        conversion_goal: Number(currentMetric.conversion_goal) || 30
      };
      
      const updatedMetric = await updateClientMetrics(clientId, metricToSave);
      console.log("Metric saved successfully:", updatedMetric);
      
      if (currentMetric.id) {
        setMetrics(metrics.map(m => m.id === updatedMetric.id ? updatedMetric : m));
      } else {
        setMetrics([updatedMetric, ...metrics]);
      }
      
      setCurrentMetric(updatedMetric);
      
      toast({
        title: "Métricas actualizadas",
        description: "Las métricas del cliente han sido actualizadas correctamente"
      });
    } catch (error) {
      console.error("Error saving client metrics:", error);
      
      let errorMessage = "No se pudieron guardar las métricas del cliente";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ClientMetric, value: string) => {
    if (!currentMetric) return;
    
    let processedValue: any = value;
    if (['web_visits', 'keywords_top10', 'conversions', 'conversion_goal'].includes(field as string)) {
      if (value === '') {
        processedValue = 0;
      } else {
        const numValue = Number(value);
        processedValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
      }
    }
    
    setCurrentMetric({
      ...currentMetric,
      [field]: processedValue
    });
  };

  useEffect(() => {
    if (clientId) {
      console.log("Client ID changed, fetching metrics for:", clientId);
      fetchMetrics();
    }
  }, [clientId]);

  return {
    metrics,
    currentMetric,
    isLoading,
    isSaving,
    error,
    handleSaveMetrics,
    handleInputChange,
    setCurrentMetric
  };
};
