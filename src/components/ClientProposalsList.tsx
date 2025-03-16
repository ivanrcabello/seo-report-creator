
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Proposal, Invoice } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientInvoices } from "@/components/ClientInvoices";

interface ClientProposalsListProps {
  proposals: Proposal[];
  clientId: string;
}

export const ClientProposalsList = ({ proposals, clientId }: ClientProposalsListProps) => {
  const [linkedInvoices, setLinkedInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadInvoices = async () => {
      // Como no existe getInvoicesByProposalId, usamos un array vacío por ahora
      // Esto se podría implementar después si es necesario
      setLinkedInvoices([]);
    };

    if (proposals && proposals.length > 0) {
      loadInvoices();
    } else {
      setLinkedInvoices([]);
    }
  }, [proposals]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Facturas de la Propuesta</CardTitle>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Este cliente no tiene propuestas</p>
            <Button asChild variant="outline" className="gap-1">
              <Link to={`/proposals/new?clientId=${clientId}`}>
                <Plus className="h-4 w-4" />
                Crear Primera Propuesta
              </Link>
            </Button>
          </div>
        ) : (
          <ClientInvoices invoices={linkedInvoices} clientId={clientId} />
        )}
      </CardContent>
    </Card>
  );
};
