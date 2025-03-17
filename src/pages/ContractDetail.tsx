
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContract, getClientContracts } from "@/services/contract";
import { getClient } from "@/services/clientService";
import { SeoContract, Client } from "@/types/client";
import { ContractDetail as ContractDetailComponent } from "@/components/contracts/ContractDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<SeoContract | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) {
        setError("ID de contrato no proporcionado");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log("Fetching contract with ID:", id);
        const contractData = await getContract(id);
        
        if (contractData) {
          setContract(contractData);
          console.log("Fetching client data for contract:", contractData.clientId);
          
          const clientData = await getClient(contractData.clientId);
          if (clientData) {
            setClient(clientData);
          } else {
            console.error("Client not found for ID:", contractData.clientId);
          }
        } else {
          setError("No se encontró el contrato");
          console.error("Contract not found for ID:", id);
        }
      } catch (err: any) {
        console.error("Error fetching contract:", err);
        setError(err.message || "Error al cargar el contrato");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Cargando contrato...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
              <Button 
                onClick={() => navigate("/contracts")}
                variant="outline"
                className="mt-4"
              >
                Volver a Contratos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contract || !client) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>No se encontró el contrato solicitado</p>
              <Button 
                onClick={() => navigate("/contracts")}
                variant="outline"
                className="mt-4"
              >
                Volver a Contratos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ContractDetailComponent contract={contract} client={client} />;
}
