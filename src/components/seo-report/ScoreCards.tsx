
import { AuditResult } from "@/services/pdfAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, BarChart2, Server, Share2 } from "lucide-react";

interface ScoreCardsProps {
  auditResult: AuditResult;
}

export const ScoreCards = ({ auditResult }: ScoreCardsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-500" />
              Puntuación SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-bold ${getScoreColor(auditResult.seoScore)}`}>
                {auditResult.seoScore}%
              </div>
              <p className="mt-2 text-gray-600 text-center">
                {auditResult.seoScore >= 80 
                  ? "Excelente optimización SEO" 
                  : auditResult.seoScore >= 60 
                    ? "Optimización moderada, con aspectos a mejorar"
                    : "Necesita mejoras significativas"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Visibilidad Web
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-bold ${getScoreColor(auditResult.webVisibility)}`}>
                {auditResult.webVisibility}%
              </div>
              <p className="mt-2 text-gray-600 text-center">
                {auditResult.webVisibility >= 80 
                  ? "Alta visibilidad en buscadores" 
                  : auditResult.webVisibility >= 60 
                    ? "Visibilidad moderada, con potencial de mejora"
                    : "Baja visibilidad, requiere estrategias de optimización"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
