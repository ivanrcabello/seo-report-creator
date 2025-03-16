
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { SeoContract } from "@/types/client";
import { getClientContracts } from "@/services/contractService";
import { ContractsList } from "./ContractsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ClientContractsTabProps {
  clientName: string;
}

export const ClientContractsTab = ({ clientName }: ClientContractsTabProps) => {
  // Update to correctly extract the client ID from the URL parameter
  const { clientId } = useParams<{ clientId: string }>();
  const id = clientId || "";
  
  const { toast } = useToast();
  const [contracts, setContracts] = useState<SeoContract[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    if (!id) {
      console.error("Client ID is missing in ClientContractsTab, id:", id);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching contracts for client ID:", id);
      const contractsData = await getClientContracts(id);
      console.log("Contracts data received:", contractsData);
      setContracts(contractsData);
    } catch (error) {
      console.error("Error fetching client contracts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los contratos del cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [id, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contratos</CardTitle>
          <CardDescription>Contratos de servicios SEO para {clientName}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Cargando contratos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ContractsList
      contracts={contracts}
      clientName={clientName}
      onContractDeleted={fetchContracts}
      emptyMessage={`No hay contratos disponibles para ${clientName}`}
      allowNewContract={true}
      clientId={id}
    />
  );
};
