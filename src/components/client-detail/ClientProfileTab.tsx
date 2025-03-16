
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Client } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Mail, Phone, Building, Calendar, FileText, Award, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientProfileTabProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
}

export const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client, onSave }) => {
  // Calculate client tenure in months
  const calculateTenure = () => {
    const startDate = new Date(client.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const clientTenure = calculateTenure();
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
          <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent flex items-center gap-2">
            <User className="h-5 w-5 text-seo-blue" />
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
              <div className="flex items-center gap-2">
                <p className="text-lg">{format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                  {clientTenure} {clientTenure === 1 ? 'mes' : 'meses'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="h-4 w-4 text-seo-blue" />
                Último informe
              </h3>
              <p className="text-lg">
                {client.lastReport 
                  ? (
                    <span className="flex items-center">
                      {format(new Date(client.lastReport), "d 'de' MMMM, yyyy", { locale: es })}
                      <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">Reciente</Badge>
                    </span>
                  ) 
                  : (
                    <span className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Sin informes
                    </span>
                  )
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
          <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent flex items-center gap-2">
            <Award className="h-5 w-5 text-seo-blue" />
            Estado de los servicios
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Google Analytics</h3>
              <div>
                <Badge 
                  variant={client.analyticsConnected ? "default" : "secondary"}
                  className={client.analyticsConnected ? "bg-green-500" : "bg-gray-200 text-gray-700"}
                >
                  {client.analyticsConnected ? 'Conectado' : 'No conectado'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Google Search Console</h3>
              <div>
                <Badge 
                  variant={client.searchConsoleConnected ? "default" : "secondary"}
                  className={client.searchConsoleConnected ? "bg-green-500" : "bg-gray-200 text-gray-700"}
                >
                  {client.searchConsoleConnected ? 'Conectado' : 'No conectado'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Estado del cliente</h3>
              <div>
                <Badge 
                  variant={client.isActive ? "default" : "secondary"}
                  className={client.isActive ? "bg-green-500" : "bg-red-100 text-red-700 border-red-200"}
                >
                  {client.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
