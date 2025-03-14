
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProposal, sendProposal, acceptProposal, rejectProposal, deleteProposal } from "@/services/proposalService";
import { getClient } from "@/services/clientService";
import { getSeoPack } from "@/services/packService";
import { toast } from "sonner";
import { isAfter } from "date-fns";
import { ArrowLeft, Separator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { ClientInfoCard } from "@/components/proposals/ClientInfoCard";
import { PackageDetails } from "@/components/proposals/PackageDetails";
import { ProposalDetails } from "@/components/proposals/ProposalDetails";
import { ProposalActions } from "@/components/proposals/ProposalActions";

const ProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get proposal data
  const { data: proposal, isLoading: isLoadingProposal } = useQuery({
    queryKey: ["proposal", id],
    queryFn: () => getProposal(id!),
    enabled: !!id
  });

  // Get client data
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ["client", proposal?.clientId],
    queryFn: () => getClient(proposal!.clientId),
    enabled: !!proposal
  });

  // Get package data
  const { data: pack, isLoading: isLoadingPack } = useQuery({
    queryKey: ["pack", proposal?.packId],
    queryFn: () => getSeoPack(proposal!.packId),
    enabled: !!proposal
  });

  // Check if proposal has expired
  const isExpired = (proposal: any): boolean => {
    if (!proposal.expiresAt) return false;
    return isAfter(new Date(), new Date(proposal.expiresAt));
  };

  // Mutation to send a proposal
  const sendProposalMutation = useMutation({
    mutationFn: () => sendProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta enviada correctamente");
    },
    onError: (error) => {
      toast.error("Error al enviar la propuesta");
      console.error(error);
    }
  });

  // Mutation to accept a proposal
  const acceptProposalMutation = useMutation({
    mutationFn: () => acceptProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta marcada como aceptada");
    },
    onError: (error) => {
      toast.error("Error al aceptar la propuesta");
      console.error(error);
    }
  });

  // Mutation to reject a proposal
  const rejectProposalMutation = useMutation({
    mutationFn: () => rejectProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta marcada como rechazada");
    },
    onError: (error) => {
      toast.error("Error al rechazar la propuesta");
      console.error(error);
    }
  });

  // Mutation to delete a proposal
  const deleteProposalMutation = useMutation({
    mutationFn: () => deleteProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta eliminada correctamente");
      navigate("/proposals");
    },
    onError: (error) => {
      toast.error("Error al eliminar la propuesta");
      console.error(error);
    }
  });

  // Loading state
  const isLoading = isLoadingProposal || isLoadingClient || isLoadingPack;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-100 rounded mb-4 max-w-md"></div>
          <div className="h-96 bg-gray-100 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  if (!proposal || !client || !pack) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Propuesta no encontrada</h1>
          <p className="mb-4">La propuesta que estás buscando no existe o no está disponible.</p>
          <Button onClick={() => navigate("/proposals")} variant="outline">
            Volver a Propuestas
          </Button>
        </div>
      </div>
    );
  }

  const proposalExpired = proposal.status === "sent" && isExpired(proposal);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/proposals")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <ProposalStatusBadge status={proposal.status} expired={proposalExpired} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {proposal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProposalDetails 
                proposal={proposal} 
                client={client} 
                proposalExpired={proposalExpired} 
              />
              
              <Separator className="h-px bg-gray-200" />
              
              <PackageDetails 
                pack={pack} 
                customPrice={proposal.customPrice} 
                customFeatures={proposal.customFeatures} 
              />
            </CardContent>
            <CardFooter>
              <ProposalActions 
                proposalId={proposal.id}
                status={proposal.status}
                isExpired={proposalExpired}
                onDelete={() => deleteProposalMutation.mutate()}
                onSend={() => sendProposalMutation.mutate()}
                onAccept={() => acceptProposalMutation.mutate()}
                onReject={() => rejectProposalMutation.mutate()}
              />
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <ClientInfoCard client={client} />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
