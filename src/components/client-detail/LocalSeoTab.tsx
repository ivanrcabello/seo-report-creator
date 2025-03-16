
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LocalSeoReportView } from "@/components/LocalSeoReportView";
import { SeoLocalReport } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Map, FileText } from "lucide-react";

interface LocalSeoTabProps {
  isGeneratingReport: boolean;
  localSeoReports: SeoLocalReport[];
  currentLocalSeoReport: SeoLocalReport | null;
  setCurrentLocalSeoReport: (report: SeoLocalReport) => void;
  setActiveTab: (tab: string) => void;
}

export const LocalSeoTab: React.FC<LocalSeoTabProps> = ({
  isGeneratingReport,
  localSeoReports,
  currentLocalSeoReport,
  setCurrentLocalSeoReport,
  setActiveTab
}) => {
  if (isGeneratingReport) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-medium text-green-700 mb-3">Generando informe SEO local...</p>
          <p className="text-gray-500 max-w-md text-center">
            Estamos analizando los documentos, extrayendo información relevante y consultando datos de posicionamiento local
          </p>
        </CardContent>
      </Card>
    );
  }

  if (localSeoReports.length > 0) {
    const reportToShow = currentLocalSeoReport || localSeoReports[localSeoReports.length - 1];
    const previousReports = localSeoReports.filter(report => report.id !== reportToShow.id);
    
    return (
      <div className="space-y-6">
        <LocalSeoReportView report={reportToShow} />
        
        {previousReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informes SEO local anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousReports.map((report) => (
                  <div key={report.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setCurrentLocalSeoReport(report)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-500">{format(new Date(report.date), "d MMM yyyy", { locale: es })}</p>
                      </div>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12">
        <Map className="w-16 h-16 text-green-200 mb-4" />
        <h3 className="text-xl font-semibold text-center mb-2">No hay informes SEO local</h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Para generar un informe SEO local, sube documentos relacionados con el negocio y haz clic en "Generar Informe"
        </p>
        <Button onClick={() => setActiveTab("documents")} variant="outline" className="gap-1">
          <FileText className="h-4 w-4" />
          Ir a Documentos
        </Button>
      </CardContent>
    </Card>
  );
};
