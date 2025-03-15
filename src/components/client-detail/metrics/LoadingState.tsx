
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Cargando métricas del cliente..." }: LoadingStateProps) => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
      <span>{message}</span>
    </div>
  );
};
