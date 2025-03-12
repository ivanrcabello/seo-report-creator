import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { PerformanceResult } from "@/services/pdfAnalyzer";

interface PerformanceDetailsPanelProps {
  performanceResults: PerformanceResult;
}

const renderStatusIcon = (status: boolean | 'Válido' | 'Inválido' | 'No implementado') => {
  if (status === true) {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else if (status === false) {
    return <XCircle className="w-5 h-5 text-red-500" />;
  } else if (status === 'Válido') {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else {
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  }
};

export const PerformanceDetailsPanel = ({ performanceResults }: PerformanceDetailsPanelProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-amber-500" />
          Resultados de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">PageSpeed Desktop</span>
              <span className={`text-sm font-medium ${performanceResults.pageSpeed.desktop >= 80 ? 'text-green-500' : performanceResults.pageSpeed.desktop >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {performanceResults.pageSpeed.desktop}/100
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">PageSpeed Mobile</span>
              <span className={`text-sm font-medium ${performanceResults.pageSpeed.mobile >= 80 ? 'text-green-500' : performanceResults.pageSpeed.mobile >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {performanceResults.pageSpeed.mobile}/100
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Tiempo de Carga</span>
              <span className="text-sm font-medium">{performanceResults.loadTime}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Recursos Totales</span>
              <span className="text-sm font-medium">{performanceResults.resourceCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Optimización de Imágenes</span>
              {renderStatusIcon(performanceResults.imageOptimization)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Implementación de Cache</span>
              {renderStatusIcon(performanceResults.cacheImplementation)}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
