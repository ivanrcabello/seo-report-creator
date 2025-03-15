
import React, { useEffect, useState } from "react";
import { ClientProposals } from "./ClientProposals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientReports } from "./ClientReports";
import { ClientInvoices } from "./ClientInvoices";
import { ClientReport, Invoice, Proposal } from "@/types/client";
import { getClientReports } from "@/services/reportService";
import { getClientInvoices } from "@/services/invoiceService";
import { getClientProposals } from "@/services/proposalService";

interface ClientProposalsListProps {
  clientId: string;
}

export const ClientProposalsList: React.FC<ClientProposalsListProps> = ({ clientId }) => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reportsData = await getClientReports(clientId);
        const invoicesData = await getClientInvoices(clientId);
        setReports(reportsData || []);
        setInvoices(invoicesData || []);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  return (
    <Tabs defaultValue="proposals" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="reports">Informes</TabsTrigger>
        <TabsTrigger value="proposals">Propuestas</TabsTrigger>
        <TabsTrigger value="invoices">Facturas</TabsTrigger>
      </TabsList>
      <TabsContent value="reports">
        <ClientReports 
          reports={reports}
          onAddReport={() => {/* Add report functionality can be added here */}}
        />
      </TabsContent>
      <TabsContent value="proposals">
        <ClientProposals clientId={clientId} />
      </TabsContent>
      <TabsContent value="invoices">
        <ClientInvoices 
          invoices={invoices}
        />
      </TabsContent>
    </Tabs>
  );
};
