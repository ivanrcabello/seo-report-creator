
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClients } from "@/services/clientService";
import { ClientSummary } from "@/types/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Users, Mail, Building, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const mapClientsToSummary = (clients: any[]): ClientSummary[] => {
  return clients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    company: client.company,
    createdAt: client.created_at,
    isActive: client.is_active || false
  }));
};

const AdminDashboard = () => {
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const { data: clients, isLoading, isError } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  useEffect(() => {
    if (clients) {
      const summaries = mapClientsToSummary(clients);
      setClientSummaries(summaries);
    }
  }, [clients]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <div>Error al cargar los clientes.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Resumen de la actividad de los clientes y acceso rápido a la gestión.
          </p>
        </div>
        <div className="space-x-2">
          {/* Add any admin-specific actions here */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientSummaries.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
};

const ClientCard = ({ client }: { client: ClientSummary }) => {
  const createdAtDate = format(new Date(client.createdAt), 'dd/MM/yyyy', { locale: es });
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium truncate">{client.name}</CardTitle>
          <Badge variant={client.isActive ? "success" : "secondary"}>
            {client.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 opacity-70" />
            <a href={`mailto:${client.email}`} className="hover:underline">
              {client.email}
            </a>
          </div>
          {client.company && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 opacity-70" />
              <span>{client.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>Cliente desde {createdAtDate}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="absolute top-2 right-2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuItem asChild>
              <Link to={`/clients/${client.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/clients/edit/${client.id}`}>
                Editar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle><Skeleton className="h-4 w-[200px]" /></CardTitle>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;
