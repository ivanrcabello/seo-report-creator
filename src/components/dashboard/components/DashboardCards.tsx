
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileSpreadsheet,
  FileSignature,
  BarChart2,
  MessageSquare,
  FileEdit,
  MailOpen
} from "lucide-react";

interface DashboardCardsProps {
  activeClientsCount: number;
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
}

export const DashboardCards = ({
  activeClientsCount,
  invoiceStats,
  contractStats
}: DashboardCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/clients" className="block h-full">
          <CardHeader className="bg-blue-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{activeClientsCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Clientes activos</p>
            <div className="mt-4 text-sm text-blue-500 font-medium">Ver todos los clientes →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/invoices" className="block h-full">
          <CardHeader className="bg-amber-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Facturas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{invoiceStats.pendingCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Facturas pendientes</p>
            <div className="mt-4 text-sm text-amber-500 font-medium">Gestionar facturas →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/contracts" className="block h-full">
          <CardHeader className="bg-green-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Contratos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{contractStats.activeCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Contratos activos</p>
            <div className="mt-4 text-sm text-green-500 font-medium">Ver contratos →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/reports" className="block h-full">
          <CardHeader className="bg-purple-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Informes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">Informes generados</p>
            <div className="mt-4 text-sm text-purple-500 font-medium">Ver informes →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/proposals" className="block h-full">
          <CardHeader className="bg-indigo-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MailOpen className="h-5 w-5" />
              Propuestas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground mt-1">Propuestas activas</p>
            <div className="mt-4 text-sm text-indigo-500 font-medium">Ver propuestas →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/settings/templates" className="block h-full">
          <CardHeader className="bg-teal-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5" />
              Plantillas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Tipos de documentos</p>
            <div className="mt-4 text-sm text-teal-500 font-medium">Gestionar plantillas →</div>
          </CardContent>
        </Link>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link to="/tickets" className="block h-full">
          <CardHeader className="bg-rose-500 text-white pb-2 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Tickets abiertos</p>
            <div className="mt-4 text-sm text-rose-500 font-medium">Ver soporte →</div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
