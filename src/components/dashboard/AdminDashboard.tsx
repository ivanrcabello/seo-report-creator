
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from "@/services/clientService";
import { ClientSummary } from "@/types/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logger from "@/services/advancedLogService";

// Import our component files
import { OverviewTab } from './tabs/OverviewTab';
import { ClientsTab } from './tabs/ClientsTab';
import { InvoicesTab } from './tabs/InvoicesTab';
import { ContractsTab } from './tabs/ContractsTab';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardError } from './DashboardError';
import { TicketsTab } from './tabs/TicketsTab';

// Logger específico para AdminDashboard
const adminLogger = logger.getLogger('AdminDashboard');

const mapClientsToSummary = (clients: any[]): ClientSummary[] => {
  adminLogger.debug("Mapeando clientes a resumen", { clientsCount: clients?.length });
  
  if (!Array.isArray(clients)) {
    adminLogger.error("Se esperaba que clients fuera un array:", clients);
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

export function AdminDashboard() {
  adminLogger.info("Inicializando AdminDashboard");
  
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Usar un try-catch para capturar errores potenciales en useQuery
  let queryResult;
  try {
    queryResult = useQuery({
      queryKey: ['clients'],
      queryFn: getClients,
    });
  } catch (error) {
    adminLogger.error("Error al ejecutar useQuery:", error);
    queryResult = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: error,
      refetch: () => Promise.resolve()
    };
  }
  
  const { 
    data: clients, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = queryResult;

  useEffect(() => {
    adminLogger.debug("useEffect AdminDashboard - datos de clientes recibidos", { 
      hasData: !!clients, 
      isLoading, 
      isError 
    });
    
    if (clients) {
      try {
        adminLogger.debug("Procesando datos de clientes", { 
          rawData: clients, 
          isArray: Array.isArray(clients) 
        });
        
        const summaries = mapClientsToSummary(clients);
        adminLogger.debug("Resúmenes de clientes mapeados:", summaries);
        
        setClientSummaries(summaries);
        setErrorMessage(null);
      } catch (error) {
        adminLogger.error("Error al mapear clientes:", error);
        setErrorMessage("Error al procesar los datos de clientes");
        toast.error("Error al procesar los datos de clientes");
      }
    }
  }, [clients]);

  const handleRefetch = () => {
    adminLogger.info("Solicitando actualización de datos");
    toast.info("Actualizando datos de clientes...");
    refetch();
  };

  // Calcular estadísticas
  const activeClientsCount = clientSummaries.filter(client => client.isActive).length;
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
    adminLogger.debug("Renderizando estado de carga");
    return <DashboardSkeleton />;
  }

  if (isError || errorMessage) {
    adminLogger.error("Renderizando estado de error:", { 
      errorMessage, 
      queryError: error 
    });
    return <DashboardError errorMessage={errorMessage} error={error} onRetry={handleRefetch} />;
  }

  adminLogger.debug("Renderizando dashboard de administrador");
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
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="invoices">Facturación</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            activeClientsCount={activeClientsCount}
            totalClientsCount={totalClientsCount}
            invoiceStats={invoiceStats}
            contractStats={contractStats}
            clientSummaries={clientSummaries}
          />
        </TabsContent>
        
        <TabsContent value="clients">
          <ClientsTab clientSummaries={clientSummaries} />
        </TabsContent>
        
        <TabsContent value="invoices">
          <InvoicesTab invoiceStats={invoiceStats} />
        </TabsContent>
        
        <TabsContent value="contracts">
          <ContractsTab contractStats={contractStats} />
        </TabsContent>
        
        <TabsContent value="tickets">
          <TicketsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
