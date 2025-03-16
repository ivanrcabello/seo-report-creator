
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Client } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User, Mail, Phone, Building, Calendar, FileText, Award, AlertCircle, BarChart2, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface ClientProfileTabProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
}

export const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Calculate client tenure in months
  const calculateTenure = () => {
    const startDate = new Date(client.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const clientTenure = calculateTenure();
  
  // Function to navigate to metrics tab
  const handleNavigateToMetrics = () => {
    const baseUrl = location.pathname;
    navigate(`${baseUrl}?tab=metrics`);
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-md border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
          <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent flex items-center gap-2">
            <User className="h-5 w-5 text-seo-blue" />
            Información del cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Nombre
              </h3>
              <p className="text-lg font-medium">{client.name}</p>
            </div>
            
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-500" />
                Email
              </h3>
              <p className="text-lg overflow-hidden text-ellipsis">{client.email}</p>
            </div>
            
            {client.phone && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  Teléfono
                </h3>
                <p className="text-lg">{client.phone}</p>
              </div>
            )}
            
            {client.company && (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Building className="h-4 w-4 text-amber-500" />
                  Empresa
                </h3>
                <p className="text-lg">{client.company}</p>
              </div>
            )}
            
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Fecha de registro
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-lg">{format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {clientTenure} {clientTenure === 1 ? 'mes' : 'meses'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-500" />
                Último informe
              </h3>
              <p className="text-lg">
                {client.lastReport 
                  ? (
                    <span className="flex items-center">
                      {format(new Date(client.lastReport), "d 'de' MMMM, yyyy", { locale: es })}
                      <Badge className="ml-2 bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Reciente
                      </Badge>
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

      <Card className="shadow-md border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
          <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent flex items-center gap-2">
            <Award className="h-5 w-5 text-seo-blue" />
            Estado de los servicios
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                     alt="Google Analytics" 
                     className="h-5 object-contain" />
                Google Analytics
              </h3>
              <div className="flex flex-col gap-2">
                <Badge 
                  variant={client.analyticsConnected ? "default" : "secondary"}
                  className={client.analyticsConnected ? "bg-green-500 w-fit" : "bg-gray-200 text-gray-700 w-fit"}
                >
                  {client.analyticsConnected ? 'Conectado' : 'No conectado'}
                </Badge>
                
                <Progress 
                  value={client.analyticsConnected ? 100 : 0} 
                  className="h-2 mt-1" 
                  indicatorClassName={client.analyticsConnected ? "bg-green-500" : "bg-gray-300"} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <img src="https://ssl.gstatic.com/search-console/scfe/search_console-64.png" 
                     alt="Google Search Console" 
                     className="h-5 object-contain" />
                Google Search Console
              </h3>
              <div className="flex flex-col gap-2">
                <Badge 
                  variant={client.searchConsoleConnected ? "default" : "secondary"}
                  className={client.searchConsoleConnected ? "bg-green-500 w-fit" : "bg-gray-200 text-gray-700 w-fit"}
                >
                  {client.searchConsoleConnected ? 'Conectado' : 'No conectado'}
                </Badge>
                
                <Progress 
                  value={client.searchConsoleConnected ? 100 : 0} 
                  className="h-2 mt-1" 
                  indicatorClassName={client.searchConsoleConnected ? "bg-green-500" : "bg-gray-300"} 
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Estado del cliente</h3>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={client.isActive ? "default" : "secondary"}
                  className={client.isActive ? "bg-green-500 w-fit" : "bg-red-100 text-red-700 border-red-200 w-fit"}
                >
                  {client.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                
                <Progress 
                  value={client.isActive ? 100 : 0} 
                  className="h-2 flex-1" 
                  indicatorClassName={client.isActive ? "bg-green-500" : "bg-red-300"} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-seo-blue hover:bg-blue-50 shadow-sm transition-all"
              onClick={handleNavigateToMetrics}
            >
              <BarChart2 className="h-4 w-4" />
              Ver métricas detalladas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

