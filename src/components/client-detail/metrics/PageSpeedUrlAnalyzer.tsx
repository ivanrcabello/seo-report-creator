
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { analyzeWebsite, savePageSpeedReport } from "@/services/pagespeed";
import { PageSpeedReport } from "@/services/pagespeed";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageSpeedUrlAnalyzerProps {
  clientId: string;
  url: string;
  setUrl: (url: string) => void;
  setPageSpeedReport: (report: PageSpeedReport) => void;
  setError: (error: string | null) => void;
}

export const PageSpeedUrlAnalyzer = ({ 
  clientId, 
  url, 
  setUrl, 
  setPageSpeedReport, 
  setError 
}: PageSpeedUrlAnalyzerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tipVisible, setTipVisible] = useState(true);

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) {
      toast.error("Por favor, introduce una URL válida");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTipVisible(false);
      
      let formattedUrl = url;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
        setUrl(formattedUrl);
      }
      
      const report = await analyzeWebsite(formattedUrl);
      
      if (report) {
        console.log("PageSpeed analysis completed");
        setPageSpeedReport(report);
        
        try {
          const saved = await savePageSpeedReport(clientId, report);
          if (saved) {
            console.log("PageSpeed report saved successfully");
            toast.success("Análisis de PageSpeed completado y guardado");
          } else {
            console.error("Failed to save PageSpeed report");
            toast.error("Análisis completado, pero no se pudo guardar el informe");
          }
        } catch (saveError) {
          console.error("Error saving PageSpeed report:", saveError);
          toast.error("Análisis completado, pero no se pudo guardar el informe");
        }
      } else {
        throw new Error("No se pudo obtener un informe válido");
      }
    } catch (err) {
      console.error("Error analyzing URL:", err);
      setError("No se pudo analizar la URL. Por favor, inténtalo de nuevo más tarde.");
      toast.error("Error al analizar la URL. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyzeUrl();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="pageSpeedUrl">URL del sitio web</Label>
          <div className="flex mt-1">
            <Input
              id="pageSpeedUrl"
              placeholder="https://www.ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-r-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleAnalyzeUrl}
              disabled={isLoading || !url.trim()}
              className="rounded-l-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Analizar'
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {tipVisible && !isLoading && (
        <Alert className="bg-blue-50 border-blue-100">
          <AlertDescription className="text-sm text-blue-700 flex items-center gap-1">
            <span>
              Este análisis evalúa el rendimiento web usando Google PageSpeed Insights.
            </span>
            <a 
              href="https://pagespeed.web.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 inline-flex items-center ml-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="underline">Más información</span>
            </a>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
