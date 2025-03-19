
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  error: Error | string | { message: string };
  retry?: () => void;
}

export const ErrorAlert = ({ error, retry }: ErrorAlertProps) => {
  // Manejar diferentes tipos de errores
  let errorMessage: string;
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = error.message as string;
  } else {
    errorMessage = 'Se ha producido un error desconocido';
  }

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{errorMessage}</p>
        {retry && (
          <Button 
            onClick={retry} 
            variant="outline" 
            size="sm" 
            className="w-fit self-end"
          >
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
