
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface ErrorAlertProps {
  error: any;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const errorMessage = error?.message || "Se produjo un error al cargar los datos";
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
};
