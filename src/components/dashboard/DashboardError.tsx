
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  errorMessage: string | null;
  error: unknown;
  onRetry: () => void;
}

export const DashboardError = ({ errorMessage, error, onRetry }: DashboardErrorProps) => {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error al cargar los datos</h3>
            <p className="text-red-700 mt-1">
              {errorMessage || String(error) || "No se pudieron cargar los clientes. Por favor, inténtalo de nuevo."}
            </p>
            <Button 
              variant="outline" 
              className="mt-4 flex items-center gap-2"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
