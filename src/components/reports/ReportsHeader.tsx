
import { FileText, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsHeaderProps {
  isAdmin: boolean;
  handleGoBack: () => void;
  handleRetry: () => void;
  isLoading: boolean;
}

export const ReportsHeader = ({ isAdmin, handleGoBack, handleRetry, isLoading }: ReportsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          {isAdmin ? "Todos los Informes" : "Mis Informes"}
        </h1>
      </div>
      {!isLoading && (
        <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      )}
    </div>
  );
};
