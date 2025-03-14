
import { AuditResult } from "@/services/pdfAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Server, Share2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface MetricCardsProps {
  auditResult: AuditResult;
}

export const MetricCards = ({ auditResult }: MetricCardsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const renderStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'Válido') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (status === false || status === 'Inválido') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-amber-500" />
            Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold ${getScoreColor(auditResult.performance)}`}>
              {auditResult.performance}%
            </div>
            <div className="mt-4 w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Desktop: {auditResult.performanceResults.pageSpeed.desktop}%</span>
                <span>Mobile: {auditResult.performanceResults.pageSpeed.mobile}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tiempo de carga:</span>
                <span>{auditResult.performanceResults.loadTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-500" />
            Salud Técnica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">SSL</span>
              {renderStatusIcon(auditResult.technicalResults.sslStatus)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">HTTPS</span>
              {renderStatusIcon(auditResult.technicalResults.httpsRedirection)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Mobile</span>
              {renderStatusIcon(auditResult.technicalResults.mobileOptimization)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Robots.txt</span>
              {renderStatusIcon(auditResult.technicalResults.robotsTxt)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sitemap</span>
              {renderStatusIcon(auditResult.technicalResults.sitemap)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-pink-500" />
            Social y Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Presencia Social</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(auditResult.socialPresence).map(([platform, active]) => (
                  <span key={platform} className={`px-2 py-1 text-xs rounded-full ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Keywords</p>
              <div className="text-center">
                <span className="text-2xl font-bold">{auditResult.keywordsCount}</span>
                <span className="text-sm text-gray-600 block">
                  palabras clave relevantes
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
