
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building, Calendar, Clock, MailOpen, User } from "lucide-react";
import { Client, Proposal } from "@/types/client";

interface ProposalDetailsProps {
  proposal: Proposal;
  client?: Client;  // Hacemos que client sea opcional
  proposalExpired: boolean;
}

export const ProposalDetails = ({ proposal, client, proposalExpired }: ProposalDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Cliente</h3>
        <div className="space-y-2">
          {client ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{client.company || "Sin empresa"}</span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">Cargando información del cliente...</div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles de la Propuesta</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Creada: {format(new Date(proposal.createdAt), "d MMMM yyyy", { locale: es })}</span>
          </div>
          {proposal.sentAt && (
            <div className="flex items-center gap-2">
              <MailOpen className="h-4 w-4 text-gray-500" />
              <span>Enviada: {format(new Date(proposal.sentAt), "d MMMM yyyy", { locale: es })}</span>
            </div>
          )}
          {proposal.expiresAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className={proposalExpired ? "text-red-600 font-medium" : ""}>
                Expira: {format(new Date(proposal.expiresAt), "d MMMM yyyy", { locale: es })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
