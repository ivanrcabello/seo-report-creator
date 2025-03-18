
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from "@/services/clientService";
import { ClientSummary } from "@/types/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, FileText, FileSpreadsheet, FileSignature, MessageSquare, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import our component files
import { OverviewTab } from './tabs/OverviewTab';
import { ClientsTab } from './tabs/ClientsTab';
import { InvoicesTab } from './tabs/InvoicesTab';
import { ContractsTab } from './tabs/ContractsTab';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardError } from './DashboardError';
import { TicketsTab } from './tabs/TicketsTab';

interface AdminDashboardProps {
  activeTab?: string;
  newContract?: boolean;
  newProposal?: boolean;
}

const mapClientsToSummary = (clients: any[]): ClientSummary[] => {
  if (!Array.isArray(clients)) {
    console.error("Expected clients to be an array, got:", clients);
    return [];
  }

  return clients.map(client => ({
    id: client.id || '',
    name: client.name || 'Cliente sin nombre',
    email: client.email || '',
    company: client.company || '',
    createdAt: client.created_at || new Date().toISOString(),
    isActive: client.is_active !== undefined ? client.is_active : true
  }));
};

export function AdminDashboard({ activeTab, newContract, newProposal }: AdminDashboardProps) {
  const location = useLocation();
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Determine the active tab from props or URL
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const [currentTab, setCurrentTab] = useState(activeTab || tabFromUrl || "overview");
  
  useEffect(() => {
    // Update tab when URL params or activeTab prop changes
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    } else if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [tabFromUrl, activeTab]);
  
  // Log the props for debugging
  console.log("AdminDashboard props:", { activeTab, newContract, newProposal });
  
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
        console.log("Received clients data:", clients);
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

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
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

  // If we're in overview mode, show the new card-based dashboard
  if (currentTab === "overview") {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (isError || errorMessage) {
      return <DashboardError errorMessage={errorMessage} error={error} onRetry={handleRefetch} />;
    }

    return (
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Resumen de la actividad y acceso rápido a todas las funciones.
            </p>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefetch}
              title="Actualizar datos"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              title="Configuración"
              asChild
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Clients Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/dashboard?tab=clients" className="block h-full">
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
          
          {/* Invoices Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/dashboard?tab=invoices" className="block h-full">
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
          
          {/* Contracts Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/dashboard?tab=contracts" className="block h-full">
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
          
          {/* Tickets Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/dashboard?tab=tickets" className="block h-full">
              <CardHeader className="bg-purple-500 text-white pb-2 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">3</div>
                <p className="text-sm text-muted-foreground mt-1">Tickets abiertos</p>
                <div className="mt-4 text-sm text-purple-500 font-medium">Ver soporte →</div>
              </CardContent>
            </Link>
          </Card>
        </div>
        
        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
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
                <Link to="/dashboard?tab=clients">Ver todos los clientes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For other tabs, use the existing tab system
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || errorMessage) {
    return <DashboardError errorMessage={errorMessage} error={error} onRetry={handleRefetch} />;
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
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
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
