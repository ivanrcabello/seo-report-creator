
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabs } from "./navigation/DashboardTabs";
import { DashboardSummary } from "./summary/DashboardSummary";
import { useDashboardData } from "./hooks/useDashboardData";
import { ClientReports } from "@/components/ClientReports";
import { ClientProposals } from "@/components/ClientProposals";
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";
import { DocumentCenter } from "./DocumentCenter";
import { SupportTickets } from "./SupportTickets";
import { UserProfile } from "./UserProfile";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ClientDashboardProps {
  activeTab?: string;
}

export function ClientDashboard({ activeTab }: ClientDashboardProps) {
  const { user } = useAuth();
  const { metrics, isLoading, companyName } = useDashboardData();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(activeTab || "dashboard");
  
  // Parse the tab from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabFromUrl = queryParams.get("tab");
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    } else if (activeTab) {
      setCurrentTab(activeTab);
    } else {
      setCurrentTab("dashboard");
    }
  }, [location.search, activeTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard del Cliente: {companyName}</h1>
        <p className="text-gray-500">Resumen de rendimiento SEO y actividades</p>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <DashboardTabs defaultValue={currentTab} onValueChange={handleTabChange} />

        <TabsContent value="dashboard">
          <DashboardSummary metrics={metrics} />
        </TabsContent>
        
        <TabsContent value="reports">
          {user?.id && <ClientReports clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="proposals">
          {user?.id && <ClientProposals clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="contracts">
          {user?.id && <ClientContractsTab clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="invoices">
          {user?.id && <ClientInvoicesTab clientId={user.id} />}
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentCenter />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportTickets />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
