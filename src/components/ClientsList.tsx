
import { useState } from "react";
import { Link } from "react-router-dom";
import { Client } from "@/types/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, Search, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientsListProps {
  clients: Client[];
  onAddClient?: () => void;
}

export const ClientsList = ({ clients, onAddClient }: ClientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No hay informes";
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Clientes
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onAddClient} className="gap-1">
            <UserPlus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredClients.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No se encontraron clientes</p>
            <Button onClick={onAddClient} variant="outline" className="gap-1">
              <UserPlus className="h-4 w-4" />
              Añadir Cliente
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>Último Informe</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{client.email}</span>
                      {client.phone && <span className="text-xs text-gray-500">{client.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{client.company || "—"}</TableCell>
                  <TableCell className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">{format(new Date(client.createdAt), "d MMM yyyy", { locale: es })}</span>
                  </TableCell>
                  <TableCell>
                    {client.lastReport ? (
                      <Badge variant="secondary" className="font-normal gap-1">
                        <FileText className="h-3 w-3" />
                        {formatDate(client.lastReport)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 font-normal">
                        Sin informes
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
