
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditResult } from "@/services/pdfAnalyzer";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Server, 
  Search, 
  Gauge, 
  Share2 
} from "lucide-react";
import { Button } from "./ui/button";

interface AuditDetailsPanelProps {
  auditResult: AuditResult;
  activeTab: string;
  onClose: () => void;
}

export const AuditDetailsPanel = ({ auditResult, activeTab, onClose }: AuditDetailsPanelProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'seo':
        return renderSeoDetails();
      case 'visibility':
        return renderTechnicalDetails();
      case 'performance':
        return renderPerformanceDetails();
      case 'keywords':
        return renderSocialDetails();
      default:
        return null;
    }
  };

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

  const renderSeoDetails = () => {
    const { seoResults } = auditResult;
    return (
      <>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-500" />
            Resultados SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Meta Título</span>
                {renderStatusIcon(seoResults.metaTitle)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Meta Descripción</span>
                {renderStatusIcon(seoResults.metaDescription)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Etiquetas H1</span>
                <span className={`text-sm font-medium ${seoResults.h1Tags === 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {seoResults.h1Tags}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Canonicales</span>
                {renderStatusIcon(seoResults.canonicalTag)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Densidad de Palabras Clave</span>
                <span className="text-sm font-medium">{seoResults.keywordDensity}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Longitud de Contenido</span>
                <span className="text-sm font-medium">{seoResults.contentLength} palabras</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Enlaces Internos</span>
                <span className="text-sm font-medium">{seoResults.internalLinks}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Enlaces Externos</span>
                <span className="text-sm font-medium">{seoResults.externalLinks}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </>
    );
  };

  const renderTechnicalDetails = () => {
    const { technicalResults } = auditResult;
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

  const renderPerformanceDetails = () => {
    const { performanceResults } = auditResult;
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

  const renderSocialDetails = () => {
    const { socialPresence } = auditResult;
    return (
      <>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-500" />
            Presencia Social y Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Facebook</span>
                {renderStatusIcon(socialPresence.facebook)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Instagram</span>
                {renderStatusIcon(socialPresence.instagram)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">LinkedIn</span>
                {renderStatusIcon(socialPresence.linkedin)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Twitter</span>
                {renderStatusIcon(socialPresence.twitter)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Google Business</span>
                {renderStatusIcon(socialPresence.googleBusiness)}
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Palabras Clave</span>
                <span className="text-sm font-medium">{auditResult.keywordsCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </>
    );
  };

  return (
    <Card className="animate-fadeIn border border-gray-200 rounded-xl shadow-md">
      {renderTabContent()}
      <div className="flex justify-end p-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Card>
  );
};
