
import { RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvoiceShareErrorProps {
  error: string;
  isRetrying: boolean;
  onRetry: () => void;
}

export const InvoiceShareError = ({ error, isRetrying, onRetry }: InvoiceShareErrorProps) => {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-10 pb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || "No se pudo cargar la factura solicitada"}</p>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={onRetry} 
                variant="outline"
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reintentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </>
                )}
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
