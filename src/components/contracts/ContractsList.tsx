import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeoContract } from "@/types/client";
import { 
  deleteContract, 
  generateAndSaveContractPDF, 
  signContract 
} from "@/services/contract";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FilePlus, 
  MoreVertical, 
  FileEdit, 
  Trash2, 
  FileText, 
  Download,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ContractsListProps {
  contracts: SeoContract[];
  clientName?: string;
  onContractDeleted?: () => void;
  emptyMessage?: string;
  allowNewContract?: boolean;
  clientId?: string;
}

export const ContractsList = ({ 
  contracts, 
  clientName,
  onContractDeleted,
  emptyMessage = "No hay contratos disponibles",
  allowNewContract = true,
  clientId
}: ContractsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleCreateContract = () => {
    if (clientId) {
      navigate(`/contracts/new/${clientId}`);
    } else {
      navigate("/contracts/new");
    }
  };

  const handleEditContract = (id: string) => {
    navigate(`/contracts/edit/${id}`);
  };

  const handleViewContract = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  const handleDownloadContract = async (contract: SeoContract) => {
    try {
      setLoading({...loading, [contract.id]: true});
      
      let pdfUrl = contract.pdfUrl;
      
      if (!pdfUrl) {
        pdfUrl = await generateAndSaveContractPDF(contract.id);
      }
      
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "Contrato descargado",
        description: "El contrato se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast({
        title: "Error",
        description: "No se pudo descargar el contrato",
        variant: "destructive",
      });
    } finally {
      setLoading({...loading, [contract.id]: false});
    }
  };

  const handleSignContract = async (contract: SeoContract, signedBy: 'client' | 'professional') => {
    try {
      setLoading({...loading, [contract.id]: true});
      
      await signContract(contract.id, signedBy);
      
      toast({
        title: "Contrato firmado",
        description: `El contrato ha sido firmado como ${signedBy === 'client' ? 'cliente' : 'profesional'}`,
      });
      
      if (onContractDeleted) {
        onContractDeleted();
      }
    } catch (error) {
      console.error("Error signing contract:", error);
      toast({
        title: "Error",
        description: "No se pudo firmar el contrato",
        variant: "destructive",
      });
    } finally {
      setLoading({...loading, [contract.id]: false});
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este contrato? Esta acción no se puede deshacer.")) {
      try {
        setLoading({...loading, [id]: true});
        
        await deleteContract(id);
        
        toast({
          title: "Contrato eliminado",
          description: "El contrato ha sido eliminado correctamente",
        });
        
        if (onContractDeleted) {
          onContractDeleted();
        }
      } catch (error) {
        console.error("Error deleting contract:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el contrato",
          variant: "destructive",
        });
      } finally {
        setLoading({...loading, [id]: false});
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Borrador</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Activo</Badge>;
      case "completed":
        return <Badge variant="secondary">Completado</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSignedStatus = (contract: SeoContract) => {
    if (contract.signedByClient && contract.signedByProfessional) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Firmado por ambas partes</Badge>;
    } else if (contract.signedByClient) {
      return <Badge variant="outline">Firmado por cliente</Badge>;
    } else if (contract.signedByProfessional) {
      return <Badge variant="outline">Firmado por profesional</Badge>;
    } else {
      return <Badge variant="secondary">No firmado</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Contratos{clientName ? ` de ${clientName}` : ""}</CardTitle>
          <CardDescription>
            Gestiona los contratos de servicios SEO{clientName ? ` para ${clientName}` : ""}
          </CardDescription>
        </div>
        {allowNewContract && (
          <Button onClick={handleCreateContract} className="flex items-center gap-1">
            <FilePlus className="h-4 w-4" />
            Nuevo Contrato
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {contracts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Fecha inicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Firmas</TableHead>
                <TableHead>Cuota mensual</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>
                    {format(new Date(contract.startDate), "d MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{getSignedStatus(contract)}</TableCell>
                  <TableCell>{contract.monthlyFee.toLocaleString('es-ES')} €</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={loading[contract.id]}>
                          {loading[contract.id] ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewContract(contract.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver contrato
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditContract(contract.id)}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadContract(contract)}>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!contract.signedByClient && (
                          <DropdownMenuItem onClick={() => handleSignContract(contract, 'client')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Firmar como cliente
                          </DropdownMenuItem>
                        )}
                        {!contract.signedByProfessional && (
                          <DropdownMenuItem onClick={() => handleSignContract(contract, 'professional')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Firmar como profesional
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <FileText className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p>{emptyMessage}</p>
            {allowNewContract && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateContract}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Crear nuevo contrato
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
