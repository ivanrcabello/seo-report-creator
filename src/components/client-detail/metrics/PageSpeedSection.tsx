
import { useState, useEffect } from "react";
import { getPageSpeedReport, PageSpeedReport } from "@/services/pagespeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { ErrorAlert } from "./ErrorAlert";
import { PageSpeedIndicator } from "./PageSpeedIndicator";
import { PageSpeedUrlAnalyzer } from "./PageSpeedUrlAnalyzer";
import { PageSpeedReportGenerator } from "./PageSpeedReportGenerator";
import { PageSpeedLoadingState } from "./PageSpeedLoadingState";
import { PageSpeedEmptyState } from "./PageSpeedEmptyState";
import { PageSpeedReportTabs } from "./PageSpeedReportTabs";

interface PageSpeedSectionProps {
  clientId: string;
  clientName: string;
}

export const PageSpeedSection = ({ clientId, clientName }: PageSpeedSectionProps) => {
  const [url, setUrl] = useState("");
  const [pageSpeedReport, setPageSpeedReport] = useState<PageSpeedReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        setLoadingReport(true);
        console.log("Obteniendo último informe PageSpeed para cliente:", clientId);
        const report = await getPageSpeedReport(clientId);
        
        if (report) {
          console.log("Informe PageSpeed encontrado:", report.id);
          setPageSpeedReport(report);
          
          if (report?.metrics?.url) {
            setUrl(report.metrics.url);
          }
        } else {
          console.log("No se encontró informe PageSpeed para cliente:", clientId);
        }
      } catch (err) {
        console.log("Error al obtener informe PageSpeed para cliente:", clientId, err);
        // No establecemos error aquí, ya que es normal que nuevos clientes no tengan informes
      } finally {
        setLoadingReport(false);
      }
    };

    if (clientId) {
      fetchLatestReport();
    }
  }, [clientId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-500" />
              Análisis de Rendimiento Web
            </CardTitle>
            <CardDescription>Métricas de Google PageSpeed Insights</CardDescription>
          </div>
          
          {pageSpeedReport && pageSpeedReport.metrics && (
            <div className="flex items-center gap-4">
              <PageSpeedIndicator 
                score={pageSpeedReport.metrics.performance_score} 
                showLabel 
              />
              <PageSpeedReportGenerator 
                pageSpeedReport={pageSpeedReport} 
                clientId={clientId} 
                clientName={clientName} 
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <PageSpeedUrlAnalyzer 
            clientId={clientId} 
            url={url} 
            setUrl={setUrl} 
            setPageSpeedReport={setPageSpeedReport} 
            setError={setError}
          />

          {loadingReport ? (
            <PageSpeedLoadingState />
          ) : error ? (
            <ErrorAlert error={{ message: error }} />
          ) : !pageSpeedReport ? (
            <PageSpeedEmptyState />
          ) : (
            <PageSpeedReportTabs pageSpeedReport={pageSpeedReport} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
