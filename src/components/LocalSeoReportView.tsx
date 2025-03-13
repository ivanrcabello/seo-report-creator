
import { SeoLocalReport } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Map, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Globe,
  Share2,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LocalSeoReportViewProps {
  report: SeoLocalReport;
}

export const LocalSeoReportView = ({ report }: LocalSeoReportViewProps) => {
  const { toast } = useToast();
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showAllListings, setShowAllListings] = useState(false);
  
  const getStatusIcon = (status: 'claimed' | 'unclaimed' | 'inconsistent') => {
    switch (status) {
      case 'claimed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'unclaimed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'inconsistent':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const getStatusText = (status: 'claimed' | 'unclaimed' | 'inconsistent') => {
    switch (status) {
      case 'claimed':
        return "Reclamado";
      case 'unclaimed':
        return "No reclamado";
      case 'inconsistent':
        return "Inconsistente";
    }
  };
  
  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600 font-semibold";
    if (position <= 10) return "text-blue-600";
    if (position <= 20) return "text-amber-600";
    return "text-gray-600";
  };
  
  const handleShareReport = () => {
    toast({
      title: "Compartir informe",
      description: "Función de compartir informe por implementar",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Descargar informe",
      description: "Función de descarga por implementar",
    });
  };

  const handlePrintReport = () => {
    window.print();
    toast({
      title: "Imprimiendo informe",
      description: "El informe se está enviando a la impresora",
    });
  };
  
  // Limitar la cantidad de elementos a mostrar inicialmente
  const visibleKeywords = showAllKeywords 
    ? report.keywordRankings || [] 
    : (report.keywordRankings || []).slice(0, 3);
    
  const visibleListings = showAllListings 
    ? report.localListings || [] 
    : (report.localListings || []).slice(0, 3);

  return (
    <Card className="mt-8 print:mt-4 print:shadow-none border-2 border-green-100">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              Informe SEO Local
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {report.businessName} - {format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es })}
            </CardDescription>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShareReport} className="gap-1">
              <Share2 className="w-4 h-4" /> Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadReport} className="gap-1">
              <Download className="w-4 h-4" /> Descargar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport} className="gap-1">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Ubicación analizada</h3>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 text-lg font-medium text-green-800">
                <Map className="h-5 w-5" />
                {report.location}
              </div>
              {report.googleMapsRanking && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 border-green-200 text-green-800 px-3 py-1">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Posición en Google Maps: #{report.googleMapsRanking}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold">Palabras clave locales</h3>
            </div>
            <div className="space-y-3">
              {visibleKeywords.map((keyword, index) => (
                <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="font-medium text-gray-800">{keyword.keyword}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Ranking: <span className={getPositionColor(keyword.position)}>#{keyword.position}</span></span>
                    </div>
                    {keyword.localPosition && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Local: <span className={getPositionColor(keyword.localPosition)}>#{keyword.localPosition}</span></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(report.keywordRankings?.length || 0) > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAllKeywords(!showAllKeywords)}
                  className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  {showAllKeywords ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" /> Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" /> Ver todas ({report.keywordRankings?.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Presencia en directorios locales</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {visibleListings.map((listing, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800 mb-2">{listing.platform}</p>
                  {getStatusIcon(listing.status)}
                </div>
                <Badge variant="outline" className={`
                  px-2 py-0.5 text-xs font-medium
                  ${listing.status === 'claimed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                  ${listing.status === 'unclaimed' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                  ${listing.status === 'inconsistent' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                `}>
                  {getStatusText(listing.status)}
                </Badge>
                {listing.url && (
                  <div className="mt-2">
                    <a 
                      href={listing.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Ver perfil <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {(report.localListings?.length || 0) > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAllListings(!showAllListings)}
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {showAllListings ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Ver todos ({report.localListings?.length})
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Recomendaciones para SEO Local</h3>
          </div>
          <div className="space-y-3">
            {report.recommendations?.map((recommendation, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-800">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-sm text-gray-500 print:hidden">
        <p>Este informe de SEO local fue generado automáticamente basado en el análisis de los documentos proporcionados.</p>
      </CardFooter>
    </Card>
  );
};
