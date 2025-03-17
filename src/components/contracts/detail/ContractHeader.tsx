
import { SeoContract, Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CalendarDays, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContractHeaderProps {
  contract: SeoContract;
  client: Client;
}

export const ContractHeader = ({ contract, client }: ContractHeaderProps) => {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{contract.title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Contrato ID: {contract.id.substring(0, 8)}
            </p>
          </div>
          <Badge className={
            contract.status === 'active' ? "bg-green-100 text-green-800" :
            contract.status === 'completed' ? "bg-blue-100 text-blue-800" :
            contract.status === 'cancelled' ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }>
            {contract.status === 'active' ? "Activo" :
             contract.status === 'completed' ? "Completado" :
             contract.status === 'cancelled' ? "Cancelado" :
             "Borrador"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              <span className="font-medium">{client.name}</span>
            </div>
            {client.company && (
              <p className="text-gray-600 mt-1 ml-7">{client.company}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Periodo</h3>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
              <div>
                <p>Inicio: {format(new Date(contract.startDate), "d MMMM yyyy", { locale: es })}</p>
                {contract.endDate && (
                  <p>Fin: {format(new Date(contract.endDate), "d MMMM yyyy", { locale: es })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Honorarios</h3>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">Fase Inicial: {contract.phase1Fee.toLocaleString('es-ES')} €</p>
              <p className="font-medium">Cuota Mensual: {contract.monthlyFee.toLocaleString('es-ES')} €</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Estado de Firmas</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${contract.signedByProfessional ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 ${contract.signedByProfessional ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm">Profesional</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${contract.signedByClient ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 ${contract.signedByClient ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm">Cliente</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
