
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Invoice } from "@/types/client";
import { useNavigate } from "react-router-dom";

interface InvoiceFormSkeletonProps {
  isNewInvoice: boolean;
  invoice: Invoice | null;
}

export const InvoiceFormSkeleton = ({ isNewInvoice, invoice }: InvoiceFormSkeletonProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            {isNewInvoice ? "Nueva Factura" : `Editando Factura ${invoice?.invoiceNumber}`}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <CardDescription>
          {isNewInvoice ? "Cargando datos..." : `Cargando factura...`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando información...</p>
        </div>
      </CardContent>
    </Card>
  );
};
