
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface DashboardErrorProps {
  errorMessage: string;
  error: string;
  onRetry: () => void;
}

export const DashboardError = ({ errorMessage, error, onRetry }: DashboardErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-50 rounded-lg p-8">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Error</h2>
      <p className="text-gray-600 mb-1">{errorMessage}</p>
      <p className="text-sm text-gray-500 mb-4 max-w-md text-center">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Reintentar
      </Button>
    </div>
  );
};
