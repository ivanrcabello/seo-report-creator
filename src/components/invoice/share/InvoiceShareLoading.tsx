
import { Loader2 } from "lucide-react";

export const InvoiceShareLoading = () => {
  return (
    <div className="container mx-auto py-12 flex justify-center items-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg text-gray-600">Cargando factura...</p>
      </div>
    </div>
  );
};
