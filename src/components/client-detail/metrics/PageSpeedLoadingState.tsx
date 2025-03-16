
import { Loader2 } from "lucide-react";

export const PageSpeedLoadingState = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <p className="ml-2 text-gray-500">Cargando informe de PageSpeed...</p>
    </div>
  );
};
