
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getProposal, getClient, getSeoPack, sendProposal, acceptProposal, rejectProposal, generatePublicProposalUrl, downloadProposalPdf } from "@/services/proposalService";
import { ProposalDetails } from "@/components/proposals/ProposalDetails";
import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { ClientInfoCard } from "@/components/proposals/ClientInfoCard";
import { PackageDetails } from "@/components/proposals/PackageDetails";
import { ProposalActions } from "@/components/proposals/ProposalActions";
import { toast } from "sonner";
import { ArrowLeft, Download, Send, Check, X, Share2, Loader2 } from "lucide-react";
import { generateProposalContent } from "@/services/openai/proposalService";
import ReactMarkdown from "react-markdown";

export default function ProposalDetail() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Cargar datos de la propuesta
  const { 
    data: proposal, 
    isLoading: isLoadingProposal,
    refetch: refetchProposal
  } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: () => proposalId ? getProposal(proposalId) : undefined,
    enabled: !!proposalId
  });

  // Cargar datos del cliente
  const { data: client } = useQuery({
    queryKey: ["client", proposal?.clientId],
    queryFn: () => proposal?.clientId ? getClient(proposal.clientId) : undefined,
    enabled: !!proposal?.clientId
  });

  // Cargar datos del paquete
  const { data: pack } = useQuery({
    queryKey: ["package", proposal?.packId],
    queryFn: () => proposal?.packId ? getSeoPack(proposal.packId) : undefined,
    enabled: !!proposal?.packId
  });

  // Verificar si la propuesta ha expirado
  const proposalExpired = proposal?.expiresAt 
    ? new Date(proposal.expiresAt) < new Date() 
    : false;

  // Manejar el envío de la propuesta
  const handleSendProposal = async () => {
    if (!proposalId) return;
    
    setLoadingAction("send");
    try {
      await sendProposal(proposalId);
      toast.success("Propuesta enviada correctamente");
      refetchProposal();
    } catch (error) {
      console.error("Error al enviar propuesta:", error);
      toast.error("Error al enviar la propuesta");
    } finally {
      setLoadingAction(null);
    }
  };

  // Manejar la aceptación de la propuesta
  const handleAcceptProposal = async () => {
    if (!proposalId) return;
    
    setLoadingAction("accept");
    try {
      await acceptProposal(proposalId);
      toast.success("Propuesta aceptada correctamente");
      refetchProposal();
    } catch (error) {
      console.error("Error al aceptar propuesta:", error);
      toast.error("Error al aceptar la propuesta");
    } finally {
      setLoadingAction(null);
    }
  };

  // Manejar el rechazo de la propuesta
  const handleRejectProposal = async () => {
    if (!proposalId) return;
    
    setLoadingAction("reject");
    try {
      await rejectProposal(proposalId);
      toast.success("Propuesta rechazada correctamente");
      refetchProposal();
    } catch (error) {
      console.error("Error al rechazar propuesta:", error);
      toast.error("Error al rechazar la propuesta");
    } finally {
      setLoadingAction(null);
    }
  };

  // Manejar la compartición de la propuesta
  const handleShareProposal = async () => {
    if (!proposalId) return;
    
    setLoadingAction("share");
    try {
      const shareUrl = await generatePublicProposalUrl(proposalId);
      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles", {
          description: "Puedes compartirlo directamente con tu cliente."
        });
      } else {
        toast.error("Error al generar enlace de compartir");
      }
    } catch (error) {
      console.error("Error al compartir propuesta:", error);
      toast.error("Error al compartir la propuesta");
    } finally {
      setLoadingAction(null);
    }
  };

  // Manejar la descarga de la propuesta en PDF
  const handleDownloadPdf = async () => {
    if (!proposalId) return;
    
    setLoadingAction("download");
    try {
      const success = await downloadProposalPdf(proposalId);
      if (success) {
        toast.success("Propuesta descargada correctamente");
      } else {
        toast.error("Error al descargar la propuesta");
      }
    } catch (error) {
      console.error("Error al descargar propuesta:", error);
      toast.error("Error al descargar la propuesta");
    } finally {
      setLoadingAction(null);
    }
  };

  // Generar contenido de propuesta con AI
  const handleGenerateAIContent = async () => {
    if (!client || !pack || !proposal) return;
    
    setLoadingAI(true);
    try {
      const content = await generateProposalContent(client, pack);
      if (!content) {
        throw new Error("No se pudo generar el contenido");
      }
      
      // Actualizar el contenido AI de la propuesta
      await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiContent: content })
      });
      
      toast.success("Contenido generado correctamente");
      refetchProposal();
      setActiveTab("ai-content");
    } catch (error) {
      console.error("Error al generar contenido AI:", error);
      toast.error("Error al generar contenido con IA");
    } finally {
      setLoadingAI(false);
    }
  };

  if (isLoadingProposal) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Propuesta no encontrada</h2>
              <p className="text-gray-500 mb-6">La propuesta que buscas no existe o ha sido eliminada.</p>
              <Button onClick={() => navigate("/proposals")}>Volver a Propuestas</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/proposals")} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{proposal.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <ProposalStatusBadge status={proposal.status} />
              {proposalExpired && proposal.status === 'sent' && (
                <span className="text-xs text-red-600 font-medium">Caducada</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={loadingAction === "download"}
            className="gap-1"
          >
            {loadingAction === "download" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </Button>
          
          {proposal.status === 'draft' && (
            <Button
              size="sm"
              onClick={handleSendProposal}
              disabled={loadingAction === "send"}
              className="gap-1"
            >
              {loadingAction === "send" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar
            </Button>
          )}
          
          {proposal.status === 'sent' && !proposalExpired && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareProposal}
                disabled={loadingAction === "share"}
                className="gap-1"
              >
                {loadingAction === "share" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                Compartir
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRejectProposal}
                disabled={loadingAction === "reject"}
                className="gap-1"
              >
                {loadingAction === "reject" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Rechazar
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleAcceptProposal}
                disabled={loadingAction === "accept"}
                className="gap-1"
              >
                {loadingAction === "accept" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Aceptar
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="ai-content">
                Contenido IA
                {loadingAI && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Detalles de la Propuesta</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProposalDetails 
                    proposal={proposal} 
                    client={client!} 
                    proposalExpired={proposalExpired}
                  />
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
                    <p className="text-gray-700">{proposal.description}</p>
                  </div>
                </CardContent>
              </Card>
              
              {client && pack && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PackageDetails pack={pack} customPrice={proposal.customPrice} />
                  
                  {proposal.status === 'draft' && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Contenido IA</CardTitle>
                        <CardDescription>
                          Genera contenido automáticamente para tu propuesta
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={handleGenerateAIContent}
                          disabled={loadingAI}
                          className="w-full gap-2"
                        >
                          {loadingAI ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Generar Contenido con IA</span>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ai-content">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Contenido Generado por IA</CardTitle>
                  <CardDescription>
                    Contenido automático generado basado en los datos del cliente y paquete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {proposal.aiContent ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {proposal.aiContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-gray-500 mb-4">No hay contenido generado por IA disponible</p>
                      {proposal.status === 'draft' && (
                        <Button 
                          onClick={handleGenerateAIContent}
                          disabled={loadingAI}
                          className="gap-2"
                        >
                          {loadingAI ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Generar Contenido con IA</span>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          {client && (
            <ClientInfoCard client={client} />
          )}
          
          <ProposalActions 
            proposal={proposal}
            onSend={handleSendProposal}
            onAccept={handleAcceptProposal}
            onReject={handleRejectProposal}
            onShare={handleShareProposal}
            onDownload={handleDownloadPdf}
            loading={loadingAction}
          />
        </div>
      </div>
    </div>
  );
}
