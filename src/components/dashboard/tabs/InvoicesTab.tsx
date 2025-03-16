
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoicesTabProps {
  invoiceStats: {
    pendingCount: number;
    totalAmount: string;
    paidAmount: string;
    pendingAmount: string;
  };
}

export const InvoicesTab = ({ invoiceStats }: InvoicesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Facturación</h2>
        <Button asChild>
          <Link to="/invoices/new">Nueva Factura</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Facturación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Facturado</p>
              <p className="text-2xl font-bold mt-1">{invoiceStats.totalAmount}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Pagado</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{invoiceStats.paidAmount}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Pendiente</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{invoiceStats.pendingAmount}</p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/invoices">Ver todas las facturas</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
