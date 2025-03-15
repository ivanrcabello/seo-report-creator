
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Proposal } from "@/types/client";
import { getClientProposals } from "@/services/proposalService";
import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText } from "lucide-react";
import { format } from "date-fns";

interface ClientProposalsProps {
  clientId: string;
}

export const ClientProposals: React.FC<ClientProposalsProps> = ({ clientId }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const data = await getClientProposals(clientId);
        setProposals(data);
      } catch (error) {
        console.error("Error fetching client proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchProposals();
    }
  }, [clientId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Propuestas</CardTitle>
          <Link to={`/proposals/new/${clientId}`}>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Nueva Propuesta
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-gray-500">Cargando propuestas...</div>
        ) : proposals.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p>No hay propuestas para este cliente.</p>
            <p className="mt-1 text-sm">Crea una nueva propuesta para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Link 
                key={proposal.id} 
                to={`/proposals/${proposal.id}`}
                className="block hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 pt-3 first:pt-0 px-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{proposal.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>Creado: {formatDate(proposal.createdAt)}</span>
                        {proposal.sentAt && <span>Enviado: {formatDate(proposal.sentAt)}</span>}
                      </div>
                    </div>
                    <ProposalStatusBadge status={proposal.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
