
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, MailOpen, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClientSummary } from "@/types/client";

interface DashboardActivityProps {
  clientSummaries: ClientSummary[];
}

export const DashboardActivity = ({ clientSummaries }: DashboardActivityProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <FileSpreadsheet className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Nueva factura creada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <MailOpen className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium">Propuesta enviada a cliente</p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <FileSignature className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Contrato firmado</p>
                <p className="text-xs text-gray-500">Hace 3 días</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Clientes Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {clientSummaries.filter(client => client.isActive).slice(0, 5).map(client => (
              <div key={client.id} className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500">{client.company}</div>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/clients">Ver todos los clientes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
