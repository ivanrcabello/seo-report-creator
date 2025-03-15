
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
      const data = await getClientMetrics(clientId);
      
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
      setError("No se pudieron cargar las métricas del cliente");
      toast({
        title: "Error",
        description: "No se pudieron cargar las métricas del cliente",
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
      
      const metricToSave = {
        ...currentMetric,
        web_visits: Number(currentMetric.web_visits) || 0,
        keywords_top10: Number(currentMetric.keywords_top10) || 0,
        conversions: Number(currentMetric.conversions) || 0,
        conversion_goal: Number(currentMetric.conversion_goal) || 30
      };
      
      const updatedMetric = await updateClientMetrics(clientId, metricToSave);
      
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
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudieron guardar las métricas del cliente");
      }
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron guardar las métricas del cliente",
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
    fetchMetrics();
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
