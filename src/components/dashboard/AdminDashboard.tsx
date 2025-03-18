
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from "@/services/clientService";
import { ClientSummary } from "@/types/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import our new components
import { DashboardCards } from './components/DashboardCards';
import { DashboardActivity } from './components/DashboardActivity';
import { DashboardHeader } from './components/DashboardHeader';

// Import existing components
import { OverviewTab } from './tabs/OverviewTab';
import { ClientsTab } from './tabs/ClientsTab';
import { InvoicesTab } from './tabs/InvoicesTab';
import { ContractsTab } from './tabs/ContractsTab';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardError } from './DashboardError';
import { TicketsTab } from './tabs/TicketsTab';

export interface AdminDashboardProps {
  activeTab?: string;
  newContract?: boolean;
  newProposal?: boolean;
  isNew?: boolean;
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

export function AdminDashboard({ activeTab, newContract, newProposal, isNew }: AdminDashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const [currentTab, setCurrentTab] = useState(activeTab || tabFromUrl || "overview");
  
  useEffect(() => {
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    } else if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [tabFromUrl, activeTab]);
  
  console.log("AdminDashboard props:", { activeTab, newContract, newProposal, isNew });
  
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

  const activeClientsCount = clientSummaries.filter(client => client.isActive).length;
  const totalClientsCount = clientSummaries.length;
  
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

  if (currentTab === "overview") {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (isError || errorMessage) {
      return <DashboardError errorMessage={errorMessage} error={error} onRetry={handleRefetch} />;
    }

    return (
      <div className="container mx-auto">
        <DashboardHeader onRefresh={handleRefetch} />
        <DashboardCards 
          activeClientsCount={activeClientsCount}
          invoiceStats={invoiceStats}
          contractStats={contractStats}
        />
        <DashboardActivity clientSummaries={clientSummaries} />
      </div>
    );
  }

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
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="invoices">Facturación</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
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
