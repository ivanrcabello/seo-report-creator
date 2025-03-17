
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SeoContract } from "@/types/client";
import { getContractByShareToken, signContractByClient } from "@/services/contract";
import { getClient } from "@/services/clientService";
import { ContractShareView } from "@/components/contracts/ContractShareView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ContractShare() {
  const { token } = useParams<{ token: string }>();
  const [contract, setContract] = useState<SeoContract | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchContractByToken = async () => {
    if (!token) {
      setError("No se proporcionó token de contrato");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching contract with token:", token);
      setLoading(true);
      setIsRetrying(false);
      
      const contractData = await getContractByShareToken(token);
      
      if (!contractData) {
        setError("Contrato no encontrado");
        setLoading(false);
        return;
      }
      
      setContract(contractData);
      
      // Get client information
      if (contractData.clientId) {
        const clientData = await getClient(contractData.clientId);
        setClient(clientData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared contract:", error);
      setError("Error al cargar el contrato");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractByToken();
  }, [token]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchContractByToken();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-gray-600">Cargando contrato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error || "No se pudo cargar el contrato solicitado"}</p>
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleRetry} 
                  variant="outline"
                  disabled={isRetrying}
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">No se encontró el contrato solicitado</p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ContractShareView contract={contract} client={client} />;
}
