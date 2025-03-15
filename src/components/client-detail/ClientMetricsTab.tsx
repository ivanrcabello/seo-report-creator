
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Save, AlertTriangle, Info } from "lucide-react";
import { getClientMetrics, updateClientMetrics } from "@/services/clientMetricsService";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ClientMetric {
  id: string;
  month: string;
  web_visits: number;
  keywords_top10: number;
  conversions: number;
  conversion_goal: number;
}

interface ClientMetricsTabProps {
  clientId: string;
  clientName: string;
}

export const ClientMetricsTab = ({ clientId, clientName }: ClientMetricsTabProps) => {
  const [metrics, setMetrics] = useState<ClientMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMetric, setCurrentMetric] = useState<ClientMetric | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin, userRole } = useAuth();
  
  useEffect(() => {
    console.log("Current user role:", userRole);
    console.log("Is admin:", isAdmin);
  }, [userRole, isAdmin]);

  useEffect(() => {
    fetchMetrics();
  }, [clientId]);

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
    
    console.log("Save metrics attempted by user with role:", userRole);
    console.log("isAdmin value:", isAdmin);
    
    // Removed the isAdmin check here as it's causing issues
    // The backend RLS will handle permissions
    
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
    
    let processedValue = value;
    if (['web_visits', 'keywords_top10', 'conversions', 'conversion_goal'].includes(field)) {
      if (value === '') {
        processedValue = 0 as any;
      } else {
        const numValue = Number(value);
        processedValue = isNaN(numValue) ? 0 : Math.max(0, numValue) as any;
      }
    }
    
    setCurrentMetric({
      ...currentMetric,
      [field]: processedValue
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
        <span>Cargando métricas del cliente...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {process.env.NODE_ENV === 'development' && (
              <div className="col-span-2 p-2 bg-gray-100 rounded mb-4 text-xs">
                <div>Role: {userRole || 'No role'}</div>
                <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="month">Mes</Label>
                <Input 
                  id="month" 
                  type="month" 
                  value={currentMetric?.month || ''} 
                  onChange={(e) => 
                    setCurrentMetric(prev => prev ? {...prev, month: e.target.value} : prev)
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="web_visits">Visitas Web</Label>
                <Input 
                  id="web_visits" 
                  type="number" 
                  min="0"
                  value={currentMetric?.web_visits || 0} 
                  onChange={(e) => handleInputChange('web_visits', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="keywords_top10">Keywords en Top 10</Label>
                <Input 
                  id="keywords_top10" 
                  type="number" 
                  min="0"
                  value={currentMetric?.keywords_top10 || 0} 
                  onChange={(e) => handleInputChange('keywords_top10', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="conversions">Aumento Clics</Label>
                <Input 
                  id="conversions" 
                  type="number" 
                  min="0"
                  value={currentMetric?.conversions || 0} 
                  onChange={(e) => handleInputChange('conversions', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="conversion_goal">Objetivo de Conversión</Label>
                <Input 
                  id="conversion_goal" 
                  type="number" 
                  min="0"
                  value={currentMetric?.conversion_goal || 30} 
                  onChange={(e) => handleInputChange('conversion_goal', e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={handleSaveMetrics}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Métricas
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
