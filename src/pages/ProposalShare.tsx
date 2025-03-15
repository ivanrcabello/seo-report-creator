
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Proposal } from "@/types/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProposalByShareToken } from "@/services/proposalSharingService";
import { getClient } from "@/services/clientService";
import { getSeoPack } from "@/services/packService";
import { ProposalShareView } from "@/components/ProposalShareView";

const ProposalShare = () => {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [client, setClient] = useState<any>(null);
  const [pack, setPack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!token) {
        setError("Enlace de propuesta no válido");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Fetching proposal with token:", token);
        const proposalData = await getProposalByShareToken(token);
        
        if (!proposalData) {
          setError("La propuesta no existe o el enlace no es válido");
          setIsLoading(false);
          return;
        }
        
        setProposal(proposalData);
        
        // Fetch client data
        if (proposalData.clientId) {
          const clientData = await getClient(proposalData.clientId);
          setClient(clientData);
        }
        
        // Fetch pack data
        if (proposalData.packId) {
          const packData = await getSeoPack(proposalData.packId);
          setPack(packData);
        }
        
        console.log("Proposal loaded successfully:", proposalData);
      } catch (error) {
        console.error("Error fetching proposal:", error);
        setError("Error al cargar la propuesta");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProposal();
  }, [token]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-[200px] w-full mb-4 rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!proposal || !client || !pack) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudo cargar la propuesta o faltan datos necesarios</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ProposalShareView 
        proposal={proposal} 
        client={client} 
        pack={pack} 
      />
    </div>
  );
};

export default ProposalShare;
