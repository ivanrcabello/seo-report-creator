
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SeoContract } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature, Calendar, Trash2, Edit, Eye, Plus, FileText, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { deleteContract } from "@/services/contract";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContractsListProps {
  contracts: SeoContract[];
  onContractDeleted?: () => void;
  emptyMessage?: string;
}

export function ContractsList({ contracts, onContractDeleted, emptyMessage = "No hay contratos disponibles" }: ContractsListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredContracts, setFilteredContracts] = useState<SeoContract[]>(contracts);

  useEffect(() => {
    let result = contracts;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(contract => 
        contract.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(contract => contract.status === statusFilter);
    }
    
    setFilteredContracts(result);
  }, [contracts, searchTerm, statusFilter]);

  const handleDeleteContract = async (contractId: string) => {
    setDeletingId(contractId);
    try {
      await deleteContract(contractId);
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
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-normal">
            Activo
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-normal">
            Borrador
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-normal">
            Completado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-normal">
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  // Render filter and search section
  const renderFilters = () => (
    <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex gap-3 items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar contratos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button asChild>
        <Link to="/contracts/new">
          <Plus className="h-4 w-4 mr-2" />
          Crear Contrato
        </Link>
      </Button>
    </div>
  );

  if (contracts.length === 0) {
    return (
      <div>
        {renderFilters()}
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed">
          <FileSignature className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">{emptyMessage}</p>
          <Button asChild>
            <Link to="/contracts/new">
              <Plus className="h-4 w-4 mr-2" />
              Crear Contrato
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderFilters()}
      {filteredContracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-500 mb-4">No se encontraron contratos con los filtros aplicados</p>
          <Button variant="outline" onClick={() => {setSearchTerm(""); setStatusFilter("all");}}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span className="truncate">{contract.title}</span>
                  {getStatusBadge(contract.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Inicio: {format(new Date(contract.startDate), "dd MMM yyyy", { locale: es })}
                    </span>
                  </div>
                  {contract.endDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Fin: {format(new Date(contract.endDate), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Cuota mensual: {contract.monthlyFee} €</span>
                  </div>
                  {contract.phase1Fee > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Cuota inicial: {contract.phase1Fee} €</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/contracts/${contract.id}`}>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Ver
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/contracts/edit/${contract.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente el contrato "{contract.title}" y no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteContract(contract.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {deletingId === contract.id ? (
                            <><span className="spinner mr-2"></span>Eliminando...</>
                          ) : (
                            <>Eliminar</>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {contract.pdfUrl && (
                  <div className="mt-3">
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Descargar PDF
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
