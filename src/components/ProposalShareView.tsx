
import { Proposal, SeoPack } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Calendar, 
  User, 
  Clock,
  FileText,
  CheckCircle2,
  Globe,
  TrendingUp,
  Search,
  LineChart
} from "lucide-react";

interface ProposalShareViewProps {
  proposal: Proposal;
  client: any;
  pack: SeoPack;
}

export const ProposalShareView = ({ proposal, client, pack }: ProposalShareViewProps) => {
  const formattedDate = proposal.sentAt 
    ? format(new Date(proposal.sentAt), "d 'de' MMMM, yyyy", { locale: es }) 
    : "";
  
  const expiryDate = proposal.expiresAt 
    ? format(new Date(proposal.expiresAt), "d 'de' MMMM, yyyy", { locale: es }) 
    : "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Propuesta SEO para {client?.company || client?.name || "Cliente"}
        </h1>
        <p className="text-center text-blue-100">
          Propuesta enviada el {formattedDate || "N/A"}
        </p>
      </div>

      {/* Recipient Badge */}
      <div className="flex justify-end -mt-4 mr-4">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Para: {client?.company || client?.name || "Cliente"}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 mb-8">
        <Tabs defaultValue="proposal">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="proposal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nuestra Propuesta
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Informe SEO
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposal" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-center mb-4">Propuesta de servicios SEO</h2>
                  <p className="text-center text-gray-600 mb-8">
                    Estrategia de posicionamiento web personalizada para mejorar la visibilidad online de {client?.company || client?.name || "su empresa"}.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{client?.name || "N/A"}</span>
                      </div>
                      {client?.company && (
                        <p className="text-gray-600 ml-7">{client.company}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Validez de la oferta</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>Enviada: {formattedDate || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span>Válida hasta: {expiryDate || "Sin fecha de expiración"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Package details */}
                  <div className="bg-purple-50 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Package className="h-6 w-6 text-purple-600 mr-2" />
                        <div>
                          <h3 className="text-xl font-bold text-purple-900">{pack?.name || "Paquete SEO"}</h3>
                          <p className="text-purple-700 text-sm">Paquete recomendado</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-900">
                          {(proposal.customPrice || pack?.price)?.toFixed(2) || "0.00"} €
                        </p>
                        <p className="text-sm text-purple-700">IVA incluido</p>
                      </div>
                    </div>
                    
                    <p className="text-center text-gray-700 mb-6">
                      Estrategia SEO completa para empresas en crecimiento
                    </p>

                    <h4 className="flex items-center text-purple-900 font-medium mb-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 mr-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </span>
                      Servicios incluidos
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(proposal.customFeatures || pack?.features || []).map((feature, index) => (
                        <div key={index} className="bg-white p-4 rounded-md flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why choose us */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-center mb-6">¿Por qué elegirnos?</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Experiencia probada</h4>
                          <p className="text-sm text-gray-600">Más de 5 años de experiencia en SEO y posicionamiento web</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Resultados garantizados</h4>
                          <p className="text-sm text-gray-600">Mejora de posicionamiento visible desde el primer mes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Informes detallados</h4>
                          <p className="text-sm text-gray-600">Seguimiento completo con informes quincenales de progreso</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Soporte personalizado</h4>
                          <p className="text-sm text-gray-600">Atención directa con nuestros especialistas SEO</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {proposal.description && (
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-medium mb-3">Detalles adicionales</h3>
                      <p className="text-gray-700">{proposal.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p>El informe detallado está disponible bajo solicitud.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
