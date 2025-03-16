
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Client } from "@/types/client";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, Power } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ClientHeaderProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (isActive: boolean) => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ 
  client, 
  onEdit, 
  onDelete,
  onToggleActive 
}) => {
  const handleToggleActive = (checked: boolean) => {
    onToggleActive(checked);
    toast.success(`Cliente ${checked ? 'activado' : 'desactivado'} correctamente`);
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Link to="/clients" className="mr-4">
          <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent">
          Ficha de Cliente
        </h1>
      </div>

      <Card className="mb-8 shadow-md border-0 overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between p-6 bg-gradient-to-r from-white to-gray-50 border-b">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <Badge variant={client.isActive ? "default" : "secondary"} className={client.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                {client.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <CardDescription className="text-base">
              <div className="flex flex-col space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-seo-blue" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-seo-blue" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-seo-blue" />
                    <span>{client.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-seo-blue" />
                  <span>Cliente desde {format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit} 
                className="flex items-center gap-1 border-seo-blue/30 text-seo-blue hover:bg-seo-blue/10"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDelete} 
                className="flex items-center gap-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-2 bg-gray-50 p-2 rounded-md">
              <Label htmlFor="client-active" className="flex items-center gap-2 text-sm text-gray-600">
                <Power className="h-4 w-4 text-seo-blue" />
                Estado del cliente
              </Label>
              <Switch 
                id="client-active" 
                checked={client.isActive} 
                onCheckedChange={handleToggleActive}
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
