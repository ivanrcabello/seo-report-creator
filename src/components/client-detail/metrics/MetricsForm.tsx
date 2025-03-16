
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ClientMetric } from "@/services/clientMetricsService";
import { Info, Save, BarChart2, Users, Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricsFormProps {
  currentMetric: ClientMetric | null;
  isSaving: boolean;
  handleInputChange: (field: keyof ClientMetric, value: any) => void;
  handleSaveMetrics: () => Promise<void>;
}

export const MetricsForm = ({ 
  currentMetric, 
  isSaving, 
  handleInputChange, 
  handleSaveMetrics 
}: MetricsFormProps) => {
  if (!currentMetric) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveMetrics();
  };

  const handleNumberInput = (field: keyof ClientMetric, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-500" />
          Métricas de Rendimiento
        </CardTitle>
        <CardDescription>
          Ingresa las métricas mensuales para hacer seguimiento del progreso SEO
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="month">
                Mes
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Mes para el que se registran estas métricas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="month"
                type="month"
                value={currentMetric.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <Label htmlFor="webVisits" className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-green-500" />
                Visitas Web %
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Incremento porcentual de visitas mensuales</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="webVisits"
                type="number"
                min="0"
                value={currentMetric.web_visits}
                onChange={(e) => handleNumberInput('web_visits', e.target.value)}
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <Label htmlFor="keywordsTop10" className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-1 text-blue-500" />
                Keywords TOP10
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Número de palabras clave posicionadas en el TOP10 de Google</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="keywordsTop10"
                type="number"
                min="0"
                value={currentMetric.keywords_top10}
                onChange={(e) => handleNumberInput('keywords_top10', e.target.value)}
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <Label htmlFor="conversions" className="flex items-center">
                <Target className="h-4 w-4 mr-1 text-orange-500" />
                Conversiones
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Número de conversiones obtenidas este mes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="conversions"
                type="number"
                min="0"
                value={currentMetric.conversions}
                onChange={(e) => handleNumberInput('conversions', e.target.value)}
                required
              />
            </div>
            
            <div className="lg:col-span-2">
              <Label htmlFor="conversionGoal" className="flex items-center">
                Meta Conversiones
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px]">Meta de conversiones para este mes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="conversionGoal"
                type="number"
                min="1"
                value={currentMetric.conversion_goal}
                onChange={(e) => handleNumberInput('conversion_goal', e.target.value)}
                required
              />
            </div>
            
            <div className="lg:col-span-2 flex items-end">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Métricas
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

