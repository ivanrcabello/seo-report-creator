
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeoContract } from "@/types/client";
import { getClientContracts } from "@/services/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, Pencil, FileSpreadsheet, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ClientContractsTabProps {
  clientId: string;
  clientName?: string;
}

export const ClientContractsTab = ({ clientId, clientName }: ClientContractsTabProps) => {
  const [contracts, setContracts] = useState<SeoContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching contracts for client ID:", clientId);
        const contractsData = await getClientContracts(clientId);
        console.log("Contracts data received:", contractsData);
        setContracts(contractsData || []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast.error("Error al cargar los contratos");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchContracts();
    } else {
      console.error("No clientId provided to ClientContractsTab");
      setIsLoading(false);
    }
  }, [clientId]);

  const handleCreateContract = () => {
    if (!clientId) {
      console.error("Cannot create contract: No clientId available");
      toast.error("Error: No se pudo identificar el cliente");
      return;
    }
    
    console.log("Creating new contract for client:", clientId);
    navigate(`/contracts/client/${clientId}/new`);
  };

  const handleEditContract = (contractId: string) => {
    if (!contractId) {
      console.error("Cannot edit contract: No contractId provided");
      return;
    }
    
    console.log("Editing contract with ID:", contractId, "for client:", clientId);
    navigate(`/contracts/client/${clientId}/edit/${contractId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Activo
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Borrador
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {clientName ? `Contratos de ${clientName}` : "Contratos"}
        </CardTitle>
        <Button onClick={handleCreateContract} className="gap-1">
          <Plus className="h-4 w-4" />
          Nuevo Contrato
        </Button>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No hay contratos disponibles</p>
            <Button onClick={handleCreateContract} variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Crear Primer Contrato
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-semibold text-lg">{contract.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {format(new Date(contract.startDate), "d MMMM yyyy", { locale: es })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(contract.status)}
                    <div className="flex items-center gap-1 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      <span>{contract.phase1Fee.toLocaleString("es-ES")}€ + {contract.monthlyFee.toLocaleString("es-ES")}€/mes</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleEditContract(contract.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  {contract.pdfUrl && (
                    <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3.5 w-3.5" />
                        Ver PDF
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
