
import { Loader2 } from "lucide-react";

export const InvoiceLoadingState = () => {
  return (
    <div className="flex items-center justify-center my-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <span>Cargando factura...</span>
    </div>
  );
};
