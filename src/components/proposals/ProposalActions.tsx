
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Proposal } from "@/types/client";
import { Download, Send, Check, X, Share2, Loader2 } from "lucide-react";

interface ProposalActionsProps {
  proposal: Proposal;
  onSend: () => Promise<void>;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  onShare: () => Promise<void>;
  onDownload: () => Promise<void>;
  loading: string | null;
}

export const ProposalActions: React.FC<ProposalActionsProps> = ({
  proposal,
  onSend,
  onAccept,
  onReject,
  onShare,
  onDownload,
  loading
}) => {
  // Comprobar si la propuesta ha expirado
  const expired = proposal.expiresAt ? new Date(proposal.expiresAt) < new Date() : false;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Acciones</CardTitle>
        <CardDescription>Gestiona el estado de la propuesta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onDownload}
          disabled={loading === "download"}
        >
          {loading === "download" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar PDF
        </Button>
        
        {proposal.status === 'draft' && (
          <Button
            className="w-full justify-start gap-2"
            onClick={onSend}
            disabled={loading === "send"}
          >
            {loading === "send" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar al Cliente
          </Button>
        )}
        
        {proposal.status === 'sent' && !expired && (
          <>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={onShare}
              disabled={loading === "share"}
            >
              {loading === "share" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Compartir Enlace
            </Button>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="destructive"
                className="justify-center gap-1"
                onClick={onReject}
                disabled={loading === "reject"}
              >
                {loading === "reject" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Rechazar
                  </>
                )}
              </Button>
              
              <Button
                variant="default"
                className="justify-center gap-1"
                onClick={onAccept}
                disabled={loading === "accept"}
              >
                {loading === "accept" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Aceptar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
        
        {proposal.status === 'sent' && expired && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            Esta propuesta ha caducado y ya no se puede aceptar o rechazar.
          </div>
        )}
        
        {proposal.status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
            Esta propuesta ha sido aceptada por el cliente.
          </div>
        )}
        
        {proposal.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
            Esta propuesta ha sido rechazada por el cliente.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
