
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface ErrorAlertProps {
  error: Error | any;
  message?: string;
}

export const ErrorAlert = ({ error, message }: ErrorAlertProps) => {
  // Asegurarnos de que tengamos una cadena de error válida
  const errorMessage = message || (error?.message ? error.message : "Se produjo un error al cargar los datos");
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
        {error && !message && error.stack && process.env.NODE_ENV !== 'production' && (
          <details className="mt-2 text-xs">
            <summary>Detalles técnicos</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
};
