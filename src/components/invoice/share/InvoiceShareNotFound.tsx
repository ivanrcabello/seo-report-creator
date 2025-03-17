
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const InvoiceShareNotFound = () => {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-10 pb-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">No se encontró la factura solicitada</p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
