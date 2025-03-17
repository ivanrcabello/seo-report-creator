import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Client } from "@/types/client";
import { 
  Eye, Plus, User, Building, Mail, Calendar, Search, UserPlus, 
  FileText, ScrollText, Edit, Trash2, Power, Filter, 
  ChevronsUpDown, CheckCircle2, XCircle, AlertCircle, UserCheck, UserX
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export interface ClientsListProps {
  clients: Client[];
  onAddClient: () => void;
  onEditClient: (clientId: string) => void;
  onDeleteClient: (client: Client) => void;
  onToggleStatus: (clientId: string, isActive: boolean) => void;
  isLoading?: boolean;
}

type SortField = 'name' | 'createdAt' | 'lastReport';
type SortOrder = 'asc' | 'desc';
type Filter = 'all' | 'active' | 'inactive' | 'noReports';

export const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  onAddClient, 
  onEditClient, 
  onDeleteClient,
  onToggleStatus,
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter clients based on search term and active filter/tab
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeTab === 'active') {
      return client.isActive;
    } else if (activeTab === 'inactive') {
      return !client.isActive;
    }

    switch (activeFilter) {
      case 'active':
        return client.isActive;
      case 'inactive':
        return !client.isActive;
      case 'noReports':
        return !client.lastReport;
      default:
        return true;
    }
  });

  // Get active and inactive client counts
  const activeCount = clients.filter(client => client.isActive).length;
  const inactiveCount = clients.filter(client => !client.isActive).length;

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortField === 'name') {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    } 
    else if (sortField === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    else if (sortField === 'lastReport') {
      // Handle null lastReport values
      if (!a.lastReport && !b.lastReport) return 0;
      if (!a.lastReport) return sortOrder === 'asc' ? -1 : 1;
      if (!b.lastReport) return sortOrder === 'asc' ? 1 : -1;
      
      const dateA = new Date(a.lastReport).getTime();
      const dateB = new Date(b.lastReport).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin informes";
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
  };

  const getClientStatus = (client: Client) => {
    if (!client.isActive) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
          Inactivo
        </Badge>
      );
    }

    if (!client.lastReport) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Sin informes
        </Badge>
      );
    }

    const lastReportDate = new Date(client.lastReport);
    const daysSinceReport = differenceInDays(new Date(), lastReportDate);

    if (daysSinceReport < 30) {
      return (
        <Badge variant="default" className="bg-green-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Al día
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Informe pendiente
        </Badge>
      );
    }
  };

  // Get client tenure to identify new vs long-term clients
  const getClientTenure = (createdAt: string) => {
    const months = differenceInMonths(new Date(), new Date(createdAt));
    
    if (months < 1) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Nuevo
        </Badge>
      );
    } else if (months >= 12) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          +1 año
        </Badge>
      );
    } else if (months >= 6) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          +6 meses
        </Badge>
      );
    }
    return null;
  };

  // Render the client table with the provided data
  const renderClientTable = (clients: Client[]) => {
    if (clients.length === 0) {
      return (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4 text-lg">No se encontraron clientes</p>
          <Button onClick={onAddClient} className="gap-1 bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all">
            <UserPlus className="h-4 w-4" />
            Añadir Cliente
          </Button>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-gray-100">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  Cliente
                  {sortField === 'name' && (
                    <ChevronsUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  Registro
                  {sortField === 'createdAt' && (
                    <ChevronsUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('lastReport')}>
                <div className="flex items-center gap-1">
                  Último Informe
                  {sortField === 'lastReport' && (
                    <ChevronsUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium flex items-center gap-2">
                  {client.name}
                  {getClientTenure(client.createdAt)}
                </TableCell>
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
                      {format(new Date(client.lastReport), "d MMM yyyy", { locale: es })}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 font-normal">
                      Sin informes
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {getClientStatus(client)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Switch
                      checked={client.isActive}
                      onCheckedChange={(checked) => onToggleStatus(client.id, checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/clients/${client.id}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditClient(client.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteClient(client)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-white to-gray-50 border-b">
          <div>
            <CardTitle className="text-xl font-bold">Gestión de Clientes</CardTitle>
            <CardDescription>Cargando clientes...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
        </CardContent>
      </Card>
    );
  }

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className={activeFilter === 'all' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveFilter('all')}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${activeFilter === 'all' ? 'opacity-100 text-seo-blue' : 'opacity-0'}`} />
                Todos los clientes
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={activeFilter === 'active' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveFilter('active')}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${activeFilter === 'active' ? 'opacity-100 text-seo-blue' : 'opacity-0'}`} />
                Clientes activos
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={activeFilter === 'inactive' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveFilter('inactive')}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${activeFilter === 'inactive' ? 'opacity-100 text-seo-blue' : 'opacity-0'}`} />
                Clientes inactivos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={activeFilter === 'noReports' ? 'bg-gray-100' : ''} 
                onClick={() => setActiveFilter('noReports')}
              >
                <CheckCircle2 className={`h-4 w-4 mr-2 ${activeFilter === 'noReports' ? 'opacity-100 text-seo-blue' : 'opacity-0'}`} />
                Sin informes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onAddClient} className="gap-1 bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all">
            <UserPlus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-green-50 p-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Clientes Activos
                </CardTitle>
                <CardDescription className="text-green-600">
                  {activeCount} {activeCount === 1 ? 'cliente activo' : 'clientes activos'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => setActiveTab('active')}
              >
                Ver todos
              </Button>
            </CardHeader>
          </Card>

          <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 p-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  Clientes Inactivos
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {inactiveCount} {inactiveCount === 1 ? 'cliente inactivo' : 'clientes inactivos'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setActiveTab('inactive')}
              >
                Ver todos
              </Button>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'active' | 'inactive')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-100">
              Todos los Clientes
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              Clientes Activos
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-800">
              Clientes Inactivos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {renderClientTable(sortedClients)}
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            {renderClientTable(sortedClients.filter(client => client.isActive))}
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            {renderClientTable(sortedClients.filter(client => !client.isActive))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import { MoreVertical } from "lucide-react";
