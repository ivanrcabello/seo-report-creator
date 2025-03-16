
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClients } from "@/services/clientService";
import { ClientSummary } from "@/types/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, Mail, Building, Calendar, AlertTriangle, 
  RefreshCw, Users, FileText, FileSpreadsheet, Briefcase
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ActiveUsers } from './ActiveUsers';
import { StatCard } from './StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mapClientsToSummary = (clients: any[]): ClientSummary[] => {
  if (!Array.isArray(clients)) {
    console.error("Expected clients to be an array, got:", clients);
    return [];
  }

  return clients.map(client => ({
    id: client.id || '',
    name: client.name || 'Cliente sin nombre',
    email: client.email || 'Sin email',
    company: client.company || '',
    createdAt: client.created_at || new Date().toISOString(),
    isActive: client.is_active !== undefined ? client.is_active : true
  }));
};

const AdminDashboard = () => {
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    data: clients, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  useEffect(() => {
    if (clients) {
      try {
        const summaries = mapClientsToSummary(clients);
        console.log("Mapped client summaries:", summaries);
        setClientSummaries(summaries);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error mapping clients:", error);
        setErrorMessage("Error al procesar los datos de clientes");
        toast.error("Error al procesar los datos de clientes");
      }
    }
  }, [clients]);

  const handleRefetch = () => {
    toast.info("Actualizando datos de clientes...");
    refetch();
  };

  // Calculate active clients count
  const activeClientsCount = clientSummaries.filter(client => client.isActive).length;
  
  // Calculate total clients count
  const totalClientsCount = clientSummaries.length;
  
  // Datos para estadísticas (reemplazar con datos reales más adelante)
  const invoiceStats = {
    pendingCount: 5,
    totalAmount: '12.450 €',
    paidAmount: '8.200 €',
    pendingAmount: '4.250 €'
  };
  
  const contractStats = {
    activeCount: 4,
    completedCount: 2,
    draftCount: 1,
    totalCount: 7
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || errorMessage) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error al cargar los datos</h3>
              <p className="text-red-700 mt-1">
                {errorMessage || String(error) || "No se pudieron cargar los clientes. Por favor, inténtalo de nuevo."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4 flex items-center gap-2"
                onClick={handleRefetch}
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Resumen de la actividad de los clientes y acceso rápido a la gestión.
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefetch}
            title="Actualizar datos"
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link to="/clients/new">Añadir Cliente</Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="invoices">Facturación</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
                <ActiveUsers clients={clientSummaries.filter(client => client.isActive).slice(0, 5)} />
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/clients">Ver todos los clientes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
            <Button asChild>
              <Link to="/clients/new">Añadir Cliente</Link>
            </Button>
          </div>
          
          {clientSummaries.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Añade tu primer cliente para empezar a gestionar tus proyectos SEO
              </p>
              <Button asChild>
                <Link to="/clients/new">Añadir Cliente</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientSummaries.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="contracts" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Contratos</h2>
            <Button asChild>
              <Link to="/contracts/new">Nuevo Contrato</Link>
            </Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ClientCard = ({ client }: { client: ClientSummary }) => {
  // Dar formato a la fecha de forma segura
  const formatCreatedAt = () => {
    try {
      if (!client.createdAt) return "Fecha desconocida";
      
      const date = typeof client.createdAt === 'string' ? parseISO(client.createdAt) : client.createdAt;
        
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy', { locale: es });
      }
      return "Fecha desconocida";
    } catch (error) {
      console.error("Error formatting date:", error, client.createdAt);
      return "Fecha desconocida";
    }
  };
  
  const createdAtDate = formatCreatedAt();
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium truncate">{client.name}</CardTitle>
          <Badge variant={client.isActive ? "default" : "secondary"}>
            {client.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 opacity-70" />
            <a href={`mailto:${client.email}`} className="hover:underline truncate max-w-[200px]">
              {client.email}
            </a>
          </div>
          {client.company && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 opacity-70" />
              <span className="truncate max-w-[200px]">{client.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>Cliente desde {createdAtDate}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Opciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/clients/${client.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/clients/edit/${client.id}`}>
                Editar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
