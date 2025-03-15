
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { ClientMetric } from "@/services/clientMetricsService";

interface MetricsFormProps {
  currentMetric: ClientMetric | null;
  isSaving: boolean;
  handleInputChange: (field: keyof ClientMetric, value: string) => void;
  handleSaveMetrics: () => Promise<void>;
  userRole?: string;
  isAdmin?: boolean;
}

export const MetricsForm = ({
  currentMetric,
  isSaving,
  handleInputChange,
  handleSaveMetrics,
  userRole,
  isAdmin
}: MetricsFormProps) => {
  return (
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
              handleInputChange('month', e.target.value)
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
  );
};
