
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SeoContract } from "@/types/client";
import { getContracts } from "@/services/contractService";
import { ContractsList } from "@/components/contracts/ContractsList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilePlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contracts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<SeoContract[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const contractsData = await getContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los contratos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [toast]);

  const handleCreateContract = () => {
    navigate("/contracts/new");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contratos</h1>
        <Button 
          onClick={handleCreateContract}
          className="flex items-center gap-1"
        >
          <FilePlus className="h-4 w-4" />
          Nuevo Contrato
        </Button>
      </div>
      
      <Separator className="mb-6" />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-lg">Cargando contratos...</span>
          </div>
        </div>
      ) : (
        <ContractsList 
          contracts={contracts} 
          onContractDeleted={fetchContracts}
          emptyMessage="No hay contratos disponibles. Crea tu primer contrato para empezar."
        />
      )}
    </div>
  );
};

export default Contracts;
