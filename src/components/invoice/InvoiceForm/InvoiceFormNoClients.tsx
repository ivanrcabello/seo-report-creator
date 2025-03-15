
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface InvoiceFormNoClientsProps {
  onGoBack: () => void;
}

export const InvoiceFormNoClients = ({ onGoBack }: InvoiceFormNoClientsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Nueva Factura
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGoBack}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <CardDescription>
          No hay clientes disponibles para crear facturas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Debe crear al menos un cliente antes de poder crear facturas</p>
          <Button onClick={() => navigate("/clients/new")} className="gap-1">
            Crear Cliente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
