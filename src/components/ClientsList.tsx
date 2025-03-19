
import React from 'react';
import { Client } from '@/types/client';
import { Button } from './ui/button';
import { UserPlus, Edit, Trash2, Power, PowerOff, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export interface ClientsListProps {
  clients: Client[];
  isLoading: boolean;
  onAddClient: () => void;
  onEditClient: (clientId: string) => void;
  onDeleteClient: (client: Client) => void;
  onToggleStatus: (clientId: string, isActive: boolean) => Promise<void>;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  isLoading, 
  onAddClient, 
  onEditClient, 
  onDeleteClient,
  onToggleStatus
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={onAddClient} className="flex items-center gap-2">
          <UserPlus size={18} />
          Añadir Cliente
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No hay clientes</h3>
          <p className="text-gray-500 mb-4">Añade tu primer cliente para comenzar</p>
          <Button onClick={onAddClient} variant="outline" className="flex items-center gap-2">
            <UserPlus size={16} />
            Añadir Cliente
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último reporte</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company || "-"}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={client.isActive ? "default" : "outline"}
                      className={client.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "text-gray-500"}
                    >
                      {client.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {client.lastReport ? formatDate(client.lastReport) : "Sin reportes"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEditClient(client.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = `/clients/${client.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onToggleStatus(client.id, !client.isActive)}
                          className={client.isActive ? "text-amber-600" : "text-green-600"}
                        >
                          {client.isActive ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteClient(client)}
                          className="text-red-600"
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
        </div>
      )}
    </div>
  );
};

export default ClientsList;
