
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllProposals } from "@/services/proposalService";
import { getClients } from "@/services/clientService";
import { getSeoPacks } from "@/services/packService";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Calendar, 
  User,
  Package,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  MailOpen
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Proposals = () => {
  // Obtener todas las propuestas
  const { data: proposals = [], isLoading: isLoadingProposals } = useQuery({
    queryKey: ["proposals"],
    queryFn: getAllProposals
  });

  // Obtener todos los clientes
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients
  });

  // Obtener todos los paquetes activos
  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: getSeoPacks
  });

  // Función para obtener el nombre del cliente por ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente desconocido";
  };

  // Función para obtener el nombre del paquete por ID
  const getPackName = (packId: string) => {
    const pack = packages.find(p => p.id === packId);
    return pack ? pack.name : "Paquete desconocido";
  };
  
  // Función para obtener el color y nombre del estado
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return { 
          badge: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: <FileText className="h-4 w-4" />,
          text: "Borrador" 
        };
      case "sent":
        return { 
          badge: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: <Send className="h-4 w-4" />,
          text: "Enviada" 
        };
      case "accepted":
        return { 
          badge: "bg-green-100 text-green-800 border-green-200", 
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Aceptada" 
        };
      case "rejected":
        return { 
          badge: "bg-red-100 text-red-800 border-red-200", 
          icon: <XCircle className="h-4 w-4" />,
          text: "Rechazada" 
        };
      default:
        return { 
          badge: "bg-gray-100 text-gray-800", 
          icon: <FileText className="h-4 w-4" />,
          text: status 
        };
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MailOpen className="h-8 w-8 text-purple-600" />
          Propuestas
        </h1>
        <Link to="/proposals/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Nueva Propuesta
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Todas las Propuestas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingProposals ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-100 rounded mb-4"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No hay propuestas disponibles</p>
              <Link to="/proposals/new">
                <Button variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Crear Primera Propuesta
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Paquete</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => {
                  const statusInfo = getStatusInfo(proposal.status);
                  return (
                    <TableRow key={proposal.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium">
                          <User className="h-4 w-4 text-gray-500" />
                          {getClientName(proposal.clientId)}
                        </div>
                      </TableCell>
                      <TableCell>{proposal.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-gray-500" />
                          {getPackName(proposal.packId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`font-normal flex gap-1 items-center w-fit ${statusInfo.badge}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm">
                            {format(new Date(proposal.createdAt), "d MMM yyyy", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/proposals/${proposal.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Proposals;
