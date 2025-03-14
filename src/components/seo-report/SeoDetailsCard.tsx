
import { AuditResult } from "@/services/pdfAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface SeoDetailsCardProps {
  auditResult: AuditResult;
}

export const SeoDetailsCard = ({ auditResult }: SeoDetailsCardProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-500" />
          Detalles SEO
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Meta Título</span>
              {renderStatusIcon(auditResult.seoResults.metaTitle)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Meta Descripción</span>
              {renderStatusIcon(auditResult.seoResults.metaDescription)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Etiquetas H1</span>
              <span className={`text-sm font-medium ${auditResult.seoResults.h1Tags === 0 ? 'text-red-500' : 'text-green-500'}`}>
                {auditResult.seoResults.h1Tags}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Canonicales</span>
              {renderStatusIcon(auditResult.seoResults.canonicalTag)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Densidad de Palabras Clave</span>
              <span className="text-sm font-medium">{auditResult.seoResults.keywordDensity}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Longitud de Contenido</span>
              <span className="text-sm font-medium">{auditResult.seoResults.contentLength} palabras</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Enlaces Internos</span>
              <span className="text-sm font-medium">{auditResult.seoResults.internalLinks}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Enlaces Externos</span>
              <span className="text-sm font-medium">{auditResult.seoResults.externalLinks}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
