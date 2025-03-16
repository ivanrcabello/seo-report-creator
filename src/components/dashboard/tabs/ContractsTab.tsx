
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContractsTabProps {
  contractStats: {
    activeCount: number;
    completedCount: number;
    draftCount: number;
    totalCount: number;
  };
}

export const ContractsTab = ({ contractStats }: ContractsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contratos</h2>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to="/contracts">Ver todos</Link>
          </Button>
          <Button asChild>
            <Link to="/contracts/new">Nuevo Contrato</Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estado de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold mt-1">{contractStats.totalCount}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-500">Activos</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{contractStats.activeCount}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-500">Completados</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{contractStats.completedCount}</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Borradores</p>
              <p className="text-2xl font-bold mt-1 text-gray-700">{contractStats.draftCount}</p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/contracts">Ver todos los contratos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
