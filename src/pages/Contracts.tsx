
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogger } from "@/hooks/useLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface Contract {
  id: string;
  title: string;
  clientId: string;
  client_name?: string;
  status: string;
  startDate: string;
  endDate?: string;
}

const Contracts = () => {
  const logger = useLogger("ContractsPage");
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    logger.info("Contracts page loaded");
    
    const fetchContracts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch contracts from database
        const { data: contractsData, error } = await supabase
          .from('seo_contracts')
          .select('id, title, client_id, status, start_date, end_date');
        
        if (error) {
          throw error;
        }
        
        // Get client names
        if (contractsData && contractsData.length > 0) {
          // Get unique client IDs
          const clientIds = [...new Set(contractsData.map(c => c.client_id))];
          
          // Fetch client names
          const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('id, name')
            .in('id', clientIds);
          
          if (clientsError) {
            throw clientsError;
          }
          
          // Map client names to contracts
          const clientMap = clientsData?.reduce((acc, client) => {
            acc[client.id] = client.name;
            return acc;
          }, {} as Record<string, string>) || {};
          
          const contractsWithClientNames = contractsData.map(contract => ({
            id: contract.id,
            title: contract.title,
            clientId: contract.client_id,
            client_name: clientMap[contract.client_id] || 'Cliente desconocido',
            status: contract.status,
            startDate: contract.start_date,
            endDate: contract.end_date,
          }));
          
          setContracts(contractsWithClientNames);
        } else {
          setContracts([]);
        }
      } catch (error) {
        console.error("Error loading contracts:", error);
        toast.error("No se pudieron cargar los contratos");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContracts();
  }, [logger]);

  const handleCreateContract = () => {
    navigate('/contracts/new');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Contratos</h1>
        <Button onClick={handleCreateContract} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Nuevo Contrato
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contratos activos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No hay contratos activos en este momento.</p>
              <Button 
                onClick={handleCreateContract} 
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Crear primer contrato
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map(contract => (
                <div 
                  key={contract.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                >
                  <h3 className="font-medium">{contract.title}</h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Cliente: {contract.client_name}</span>
                    <span>Estado: {contract.status === 'draft' ? 'Borrador' : 
                                  contract.status === 'active' ? 'Activo' : 
                                  contract.status === 'completed' ? 'Completado' : 
                                  contract.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contracts;
