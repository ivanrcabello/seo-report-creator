
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Save, BarChart, TrendingUp, Award, MousePointer } from "lucide-react";
import { ClientMetric } from "@/services/clientMetricsService";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
  if (!currentMetric) {
    return <div>No hay datos de métricas disponibles.</div>;
  }
  
  return (
    <div className="space-y-6">
      {process.env.NODE_ENV === 'development' && (
        <div className="col-span-2 p-2 bg-gray-100 rounded mb-4 text-xs">
          <div>Role: {userRole || 'No role'}</div>
          <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="month" className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-seo-blue" />
              Mes
            </Label>
            <Input 
              id="month" 
              type="month" 
              value={currentMetric.month || ''} 
              onChange={(e) => 
                handleInputChange('month', e.target.value)
              }
              className="mt-1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="web_visits" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-seo-blue" />
              Visitas Web (%)
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Incremento porcentual de visitas respecto al mes anterior</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[Number(currentMetric.web_visits) || 0]}
                max={100}
                step={1}
                onValueChange={(values) => handleInputChange('web_visits', values[0].toString())}
                className="flex-1"
              />
              <Input 
                id="web_visits" 
                type="number" 
                min="0"
                className="w-20"
                value={currentMetric.web_visits || 0} 
                onChange={(e) => handleInputChange('web_visits', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords_top10" className="flex items-center gap-2">
              <Award className="h-4 w-4 text-seo-blue" />
              Keywords en Top 10
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Número de palabras clave posicionadas en las primeras 10 posiciones</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[Number(currentMetric.keywords_top10) || 0]}
                max={100}
                step={1}
                onValueChange={(values) => handleInputChange('keywords_top10', values[0].toString())}
                className="flex-1"
              />
              <Input 
                id="keywords_top10" 
                type="number" 
                min="0"
                className="w-20"
                value={currentMetric.keywords_top10 || 0} 
                onChange={(e) => handleInputChange('keywords_top10', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conversions" className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-seo-blue" />
              Conversiones
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Número de conversiones logradas en el periodo</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[Number(currentMetric.conversions) || 0]}
                max={100}
                step={1}
                onValueChange={(values) => handleInputChange('conversions', values[0].toString())}
                className="flex-1"
              />
              <Input 
                id="conversions" 
                type="number" 
                min="0"
                className="w-20"
                value={currentMetric.conversions || 0} 
                onChange={(e) => handleInputChange('conversions', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conversion_goal" className="flex items-center gap-2">
              <Award className="h-4 w-4 text-seo-blue" />
              Objetivo de Conversión
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Meta de conversiones para el periodo</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[Number(currentMetric.conversion_goal) || 30]}
                max={100}
                step={1}
                onValueChange={(values) => handleInputChange('conversion_goal', values[0].toString())}
                className="flex-1"
              />
              <Input 
                id="conversion_goal" 
                type="number" 
                min="1"
                className="w-20"
                value={currentMetric.conversion_goal || 30} 
                onChange={(e) => handleInputChange('conversion_goal', e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            className="w-full mt-8"
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
    </div>
  );
};
