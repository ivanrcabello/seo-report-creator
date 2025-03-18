
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SeoContract } from "@/types/client";
import { getContracts, deleteContract } from "@/services/contract";
import { ContractsList } from "@/components/contracts/ContractsList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilePlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Contracts = () => {
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<SeoContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching contracts from service");
      const contractsData = await getContracts();
      console.log("Contracts data received:", contractsData);
      setContracts(contractsData);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError("No se pudieron cargar los contratos");
      uiToast({
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
  }, []);

  const handleCreateContract = () => {
    navigate("/contracts/new");
  };

  // Fixed function to take a contract ID parameter, but make it optional to satisfy the interface
  const handleContractDeleted = async () => {
    // Simply refresh the contracts list
    fetchContracts();
    toast.success("Contrato eliminado correctamente");
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
      ) : error ? (
        <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchContracts} variant="outline">
            Reintentar
          </Button>
        </div>
      ) : (
        <ContractsList 
          contracts={contracts}
          onContractDeleted={handleContractDeleted}
          emptyMessage="No hay contratos disponibles. Crea tu primer contrato para empezar."
        />
      )}
    </div>
  );
};

export default Contracts;
