
import React from "react";
import { ClientProposals } from "./ClientProposals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientReports } from "./ClientReports";
import { ClientInvoices } from "./ClientInvoices";

interface ClientProposalsListProps {
  clientId: string;
}

export const ClientProposalsList: React.FC<ClientProposalsListProps> = ({ clientId }) => {
  return (
    <Tabs defaultValue="reports" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="reports">Informes</TabsTrigger>
        <TabsTrigger value="proposals">Propuestas</TabsTrigger>
        <TabsTrigger value="invoices">Facturas</TabsTrigger>
      </TabsList>
      <TabsContent value="reports">
        <ClientReports clientId={clientId} />
      </TabsContent>
      <TabsContent value="proposals">
        <ClientProposals clientId={clientId} />
      </TabsContent>
      <TabsContent value="invoices">
        <ClientInvoices clientId={clientId} />
      </TabsContent>
    </Tabs>
  );
};
