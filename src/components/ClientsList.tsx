
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Client } from "@/types/client";
import { Eye, Plus, User, Building, Mail, Calendar, Search, UserPlus, FileText, ScrollText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ClientsListProps {
  clients: Client[];
  onAddClient: () => void;
  isLoading?: boolean;
}

export const ClientsList: React.FC<ClientsListProps> = ({ clients, onAddClient, isLoading = false }) => {
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
    <Card className="shadow-md border-0">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-white to-gray-50 border-b">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent">
            <User className="h-5 w-5 text-seo-blue" />
            Gestión de Clientes
          </CardTitle>
          <CardDescription>
            Administra los clientes y sus datos de contacto
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-9 border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onAddClient} className="gap-1 bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all">
            <UserPlus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4 text-lg">No se encontraron clientes</p>
            <Button onClick={onAddClient} className="gap-1 bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all">
              <UserPlus className="h-4 w-4" />
              Añadir Primer Cliente
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-b-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Último Informe</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-gray-500" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="text-xs text-gray-500 mt-1">{client.phone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.company ? (
                        <div className="flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-gray-500" />
                          <span>{client.company}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{format(new Date(client.createdAt), "d MMM yyyy", { locale: es })}</span>
                    </TableCell>
                    <TableCell>
                      {client.lastReport ? (
                        <Badge variant="secondary" className="font-normal gap-1 bg-seo-purple/10 text-seo-purple">
                          <ScrollText className="h-3 w-3" />
                          {formatDate(client.lastReport)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 font-normal">
                          Sin informes
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="border-seo-blue/30 text-seo-blue hover:bg-seo-blue/10 hover:text-seo-blue">
                        <Link to={`/clients/${client.id}`} className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
