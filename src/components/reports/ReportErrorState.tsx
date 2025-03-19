
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";

interface ReportErrorStateProps {
  error: string | Error;
  isRetrying?: boolean;
  handleRetry?: () => void;
}

export const ReportErrorState = ({ error, isRetrying = false, handleRetry }: ReportErrorStateProps) => {
  const navigate = useNavigate();
  const [isRetryingLocal, setIsRetryingLocal] = useState(isRetrying);
  
  // Convert error to string if it's an Error object
  const errorMessage = error instanceof Error ? error.message : error;
  
  const onRetry = () => {
    if (handleRetry) {
      handleRetry();
    } else {
      setIsRetryingLocal(true);
      // If no retry handler is provided, reload the page
      window.location.reload();
    }
  };
  
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
          <p className="mb-4">{errorMessage}</p>
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              onClick={onRetry} 
              variant="outline" 
              disabled={isRetryingLocal}
              className="w-full"
            >
              {isRetryingLocal ? (
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
