
import { useState } from "react";
import { Link } from "react-router-dom";
import { Proposal } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ProposalStatusBadge } from "./proposals/ProposalStatusBadge";

interface ClientProposalsListProps {
  proposals: Proposal[];
  clientId: string;
}

export const ClientProposalsList = ({ proposals, clientId }: ClientProposalsListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Propuestas del Cliente</CardTitle>
        <Link to={`/proposals/new?clientId=${clientId}`}>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Nueva Propuesta
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 mb-4">Este cliente no tiene propuestas</p>
            <Button asChild variant="outline" className="gap-1">
              <Link to={`/proposals/new?clientId=${clientId}`}>
                <Plus className="h-4 w-4" />
                Crear Primera Propuesta
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div 
                key={proposal.id}
                className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 pt-3 first:pt-0 px-1 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-start justify-between">
                  <Link to={`/proposals/${proposal.id}`} className="flex-grow">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                      {proposal.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>Creado: {format(new Date(proposal.createdAt), "dd/MM/yyyy", { locale: es })}</span>
                      {proposal.sentAt && <span>Enviado: {format(new Date(proposal.sentAt), "dd/MM/yyyy", { locale: es })}</span>}
                    </div>
                  </Link>
                  <div className="flex items-start">
                    <ProposalStatusBadge status={proposal.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
