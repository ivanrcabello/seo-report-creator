
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientMetric, getClientMetrics } from "@/services/clientMetricsService";
import { toast } from "sonner";
import logger from "@/services/logService";

const clientLogger = logger.getLogger('useClientDashboardData');

export function useClientDashboardData(user: any) {
  const [metrics, setMetrics] = useState<ClientMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Su Empresa");

  useEffect(() => {
    clientLogger.debug("useEffect ClientDashboard", { userId: user?.id });
    
    if (!user) {
      clientLogger.warn("No hay usuario autenticado");
      return;
    }

    const fetchClientData = async () => {
      clientLogger.debug("Iniciando fetchClientData para:", user.id);
      
      try {
        setIsLoading(true);
        
        // Fetch most recent metrics using the dedicated service
        if (user?.id) {
          try {
            clientLogger.debug(`Obteniendo métricas para cliente: ${user.id}`);
            const metricsData = await getClientMetrics(user.id);
            clientLogger.debug("Datos de métricas recibidos:", metricsData);
            
            if (metricsData && metricsData.length > 0) {
              setMetrics(metricsData[0]);
            } else {
              // Set default metrics if none exist
              clientLogger.info("No hay métricas, usando valores por defecto");
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
            clientLogger.error("Error al obtener métricas de cliente:", error);
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
          clientLogger.debug("Obteniendo perfil de cliente para:", user.id);
          const { data: profileData, error } = await supabase
            .from('clients')
            .select('company')
            .eq('id', user.id)
            .single();
          
          if (error) {
            clientLogger.error("Error al obtener perfil de cliente:", error);
          }
          
          if (profileData?.company) {
            clientLogger.debug("Nombre de empresa obtenido:", profileData.company);
            setCompanyName(profileData.company);
          }
        } catch (error) {
          clientLogger.error("Excepción al obtener perfil de cliente:", error);
        }
      } catch (error) {
        clientLogger.error("Error general al obtener datos de dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [user]);

  return { metrics, isLoading, companyName };
}
