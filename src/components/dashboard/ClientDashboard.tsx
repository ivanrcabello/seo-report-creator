
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

export function ClientDashboard() {
  const { user } = useAuth();
  const { metrics, isLoading, companyName } = useDashboardData();

  if (isLoading) {
    return <div className="py-8 text-center">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard del Cliente: {companyName}</h1>
        <p className="text-gray-500">Resumen de rendimiento SEO y actividades</p>
      </div>

      <Tabs defaultValue="dashboard">
        <DashboardTabs />

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
