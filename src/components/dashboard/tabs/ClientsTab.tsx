
import { Link } from 'react-router-dom';
import { ClientSummary } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ChevronRight,
  Users,
  UserPlus
} from "lucide-react";

interface ClientsTabProps {
  clientSummaries: ClientSummary[];
}

export const ClientsTab = ({ clientSummaries }: ClientsTabProps) => {
  // Mostrar solo los 5 clientes más recientes
  const recentClients = [...clientSummaries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to="/clients">Ver todos</Link>
          </Button>
          <Button asChild>
            <Link to="/clients/new" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Clientes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No hay clientes registrados. ¡Crea tu primer cliente!
                  </TableCell>
                </TableRow>
              ) : (
                recentClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.company || "—"}</TableCell>
                    <TableCell>
                      {format(new Date(client.createdAt), "d MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/clients/${client.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {recentClients.length > 0 && (
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/clients">Ver todos los clientes</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
