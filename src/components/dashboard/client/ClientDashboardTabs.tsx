
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, FileText, MailOpen, FileSignature, 
  FileSpreadsheet, MessageSquare, User 
} from "lucide-react";
import { UserProfile } from "../UserProfile";
import { SupportTickets } from "../SupportTickets";
import { DocumentCenter } from "../DocumentCenter";
import { ClientReports } from "@/components/ClientReports";
import { ClientProposals } from "@/components/ClientProposals";
import { ClientContractsTab } from "@/components/contracts/ClientContractsTab";
import { ClientInvoicesTab } from "@/components/invoice/ClientInvoicesTab";
import { useAuth } from "@/contexts/AuthContext";

interface ClientDashboardTabsProps {
  children?: ReactNode;
}

export function ClientDashboardTabs({ children }: ClientDashboardTabsProps) {
  const { user } = useAuth();
  
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mb-8">
        <TabsTrigger value="dashboard" className="flex items-center gap-1">
          <BarChart2 className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Informes
        </TabsTrigger>
        <TabsTrigger value="proposals" className="flex items-center gap-1">
          <MailOpen className="h-4 w-4" />
          Propuestas
        </TabsTrigger>
        <TabsTrigger value="contracts" className="flex items-center gap-1">
          <FileSignature className="h-4 w-4" />
          Contratos
        </TabsTrigger>
        <TabsTrigger value="invoices" className="flex items-center gap-1">
          <FileSpreadsheet className="h-4 w-4" />
          Facturas
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Documentos
        </TabsTrigger>
        <TabsTrigger value="support" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          Soporte
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          Perfil
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        {children}
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
  );
}
