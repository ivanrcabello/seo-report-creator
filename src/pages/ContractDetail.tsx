
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getContract } from "@/services/contractService";
import { SeoContract } from "@/types/client";

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<SeoContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const contractData = await getContract(id);
        setContract(contractData || null);
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

  if (!contract) {
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

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Contrato: {contract.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                <p>{contract.clientId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                <p className="capitalize">{contract.status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de inicio</h3>
                <p>{new Date(contract.startDate).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tarifa primera fase</h3>
                <p>{contract.phase1Fee} €</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tarifa mensual</h3>
                <p>{contract.monthlyFee} €</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button 
                onClick={() => navigate("/contracts")}
                variant="outline"
                className="mr-2"
              >
                Volver a Contratos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
