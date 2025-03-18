
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { ClientMetric, getClientMetrics } from "@/services/clientMetricsService";

export function useDashboardData() {
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

  return {
    metrics,
    isLoading,
    companyName
  };
}
