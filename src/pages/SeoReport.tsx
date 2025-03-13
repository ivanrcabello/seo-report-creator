import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuditResult } from "@/services/pdfAnalyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, FileDown, Printer, ArrowLeft, Globe, BarChart2, Search, Server, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AIReportGenerator } from "@/components/AIReportGenerator";
import "../styles/print.css";

const SeoReport = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.auditResult) {
      setAuditResult(location.state.auditResult);
    }
  }, [location]);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimiendo informe",
      description: "El informe se está enviando a la impresora",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Descargando informe",
      description: "El informe se descargará en formato PDF",
    });
    alert("Esta funcionalidad requiere una implementación completa de generación de PDF");
  };

  if (!auditResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="text-2xl font-bold">No hay datos disponibles</h2>
              <p className="text-gray-600">
                No se encontraron datos de auditoría para generar el informe.
              </p>
              <Button asChild className="mt-4">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'Válido') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (status === false || status === 'Inválido') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
          </Button>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" /> Descargar PDF
            </Button>
          </div>
        </div>

        <div ref={reportRef} className="space-y-8 bg-white rounded-xl shadow-lg p-8 print:shadow-none">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Informe de Análisis SEO</h1>
            <p className="text-gray-600">Generado el {new Date().toLocaleDateString()}</p>
          </div>

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

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Recomendaciones de mejora</h3>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                {auditResult.seoResults.metaTitle ? 
                  "Mantener la correcta implementación de meta títulos." : 
                  "Implementar meta títulos optimizados con palabras clave relevantes."}
              </li>
              <li>
                {auditResult.seoResults.metaDescription ? 
                  "Las meta descripciones están correctamente implementadas." : 
                  "Añadir meta descripciones atractivas que incluyan palabras clave."}
              </li>
              <li>
                {auditResult.performanceResults.pageSpeed.mobile >= 70 ? 
                  "La velocidad en dispositivos móviles es adecuada." : 
                  "Mejorar la velocidad de carga en dispositivos móviles."}
              </li>
              <li>
                {auditResult.technicalResults.mobileOptimization ? 
                  "La web está correctamente optimizada para móviles." : 
                  "Optimizar el sitio web para dispositivos móviles."}
              </li>
              <li>
                {auditResult.technicalResults.robotsTxt && auditResult.technicalResults.sitemap ? 
                  "Mantener actualizado el archivo robots.txt y sitemap." : 
                  "Implementar o corregir el archivo robots.txt y/o sitemap."}
              </li>
              <li>
                {auditResult.seoResults.h1Tags > 0 ? 
                  "Las etiquetas H1 están correctamente implementadas." : 
                  "Añadir etiquetas H1 que incluyan palabras clave relevantes."}
              </li>
              <li>
                {auditResult.seoResults.keywordDensity >= 1 ? 
                  "Mantener una densidad de palabras clave óptima." : 
                  "Aumentar la densidad de palabras clave en el contenido."}
              </li>
            </ul>
          </div>

          <AIReportGenerator auditResult={auditResult} />

          <div className="text-center pt-8 text-sm text-gray-500 print:hidden">
            <p>© {new Date().getFullYear()} Servicio de Análisis SEO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoReport;
