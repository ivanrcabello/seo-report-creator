
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Client } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Mail, Phone, Building, Calendar, FileText } from "lucide-react";

interface ClientProfileTabProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
}

export const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client, onSave }) => {
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
        <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent">
          Información del cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <User className="h-4 w-4 text-seo-blue" />
              Nombre
            </h3>
            <p className="text-lg font-medium">{client.name}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Mail className="h-4 w-4 text-seo-blue" />
              Email
            </h3>
            <p className="text-lg">{client.email}</p>
          </div>
          
          {client.phone && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4 text-seo-blue" />
                Teléfono
              </h3>
              <p className="text-lg">{client.phone}</p>
            </div>
          )}
          
          {client.company && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="h-4 w-4 text-seo-blue" />
                Empresa
              </h3>
              <p className="text-lg">{client.company}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-seo-blue" />
              Fecha de registro
            </h3>
            <p className="text-lg">{format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-seo-blue" />
              Último informe
            </h3>
            <p className="text-lg">
              {client.lastReport 
                ? format(new Date(client.lastReport), "d 'de' MMMM, yyyy", { locale: es }) 
                : "Sin informes"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
