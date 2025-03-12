import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";
import { TechnicalResult } from "@/services/pdfAnalyzer";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface TechnicalDetailsPanelProps {
  technicalResults: TechnicalResult;
}

const renderStatusIcon = (status: boolean | 'Válido' | 'Inválido' | 'No implementado') => {
  if (status === true || status === 'Válido') {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else if (status === false || status === 'Inválido') {
    return <XCircle className="w-5 h-5 text-red-500" />;
  } else {
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  }
};

export const TechnicalDetailsPanel = ({ technicalResults }: TechnicalDetailsPanelProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-500" />
          Resultados Técnicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Certificado SSL</span>
              <span className={`text-sm font-medium ${technicalResults.sslStatus === 'Válido' ? 'text-green-500' : 'text-red-500'}`}>
                {technicalResults.sslStatus}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Redirección HTTPS</span>
              {renderStatusIcon(technicalResults.httpsRedirection)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Optimización Móvil</span>
              {renderStatusIcon(technicalResults.mobileOptimization)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Robots.txt</span>
              {renderStatusIcon(technicalResults.robotsTxt)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Sitemap XML</span>
              {renderStatusIcon(technicalResults.sitemap)}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium block mb-2">Tecnologías</span>
              <div className="flex flex-wrap gap-2">
                {technicalResults.technologies.map((tech, index) => (
                  <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
