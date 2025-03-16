
import { ClientSummary } from "@/types/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActiveUsers } from '../ActiveUsers';
import { StatCard } from "../StatCard";
import { Users, FileSpreadsheet, Briefcase, FileText } from "lucide-react";

interface OverviewTabProps {
  activeClientsCount: number;
  totalClientsCount: number;
  invoiceStats: {
    pendingCount: number;
    totalAmount: string;
    paidAmount: string;
    pendingAmount: string;
  };
  contractStats: {
    activeCount: number;
    completedCount: number;
    draftCount: number;
    totalCount: number;
  };
  clientSummaries: ClientSummary[];
}

export const OverviewTab = ({ 
  activeClientsCount, 
  totalClientsCount, 
  invoiceStats, 
  contractStats, 
  clientSummaries 
}: OverviewTabProps) => {
  // Fix: Initialize clients state with clientSummaries
  const [clients, setClients] = useState<ClientSummary[]>(clientSummaries);

  return (
    <div className="space-y-6">
      {/* Estadísticas del Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Clientes Activos" 
          value={`${activeClientsCount}`}
          change={`${totalClientsCount > 0 ? ((activeClientsCount/totalClientsCount)*100).toFixed(0) : 0}%`}
          trend="up"
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Facturas Pendientes" 
          value={invoiceStats.pendingCount.toString()}
          change={invoiceStats.pendingAmount}
          trend="neutral"
          icon={<FileSpreadsheet className="h-4 w-4 text-white" />}
          color="bg-amber-500"
        />
        <StatCard 
          title="Contratos Activos" 
          value={contractStats.activeCount.toString()}
          change={`${contractStats.completedCount} completados`}
          trend="up"
          icon={<Briefcase className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
        <StatCard 
          title="Facturación Total" 
          value={invoiceStats.totalAmount}
          change="+12% vs mes anterior"
          trend="up"
          icon={<FileText className="h-4 w-4 text-white" />}
          color="bg-indigo-500"
        />
      </div>
      
      {/* Actividad y Resumen de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Aquí se mostrará la actividad reciente cuando esté disponible</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fix: Pass clientSummaries directly instead of clients state */}
            <ActiveUsers clients={clientSummaries.filter(client => client.isActive).slice(0, 5)} />
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/clients">Ver todos los clientes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
