
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

interface ReportErrorStateProps {
  error: string;
  isRetrying: boolean;
  handleRetry: () => void;
}

export const ReportErrorState = ({ error, isRetrying, handleRetry }: ReportErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{error}</p>
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              onClick={handleRetry} 
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
            <Button onClick={() => navigate("/reports")} className="w-full">
              Volver a Informes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
