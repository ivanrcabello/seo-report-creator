
import { Loader2 } from "lucide-react";

export const ReportLoadingState = () => {
  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Cargando informe...</p>
      </div>
    </div>
  );
};
