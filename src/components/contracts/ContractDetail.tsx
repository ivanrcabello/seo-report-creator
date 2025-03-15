
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SeoContract, Client } from "@/types/client";
import { getContract, signContract, generateAndSaveContractPDF } from "@/services/contractService";
import { getClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contract, setContract] = useState<SeoContract | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchContractData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const contractData = await getContract(id);
        
        if (contractData) {
          setContract(contractData);
          
          // Fetch client data
          const clientData = await getClient(contractData.clientId);
          if (clientData) {
            setClient(clientData);
          }
        } else {
          toast({
            title: "Error",
            description: "No se encontró el contrato",
            variant: "destructive",
          });
          navigate("/contracts");
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el contrato",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id, navigate, toast]);

  const handleEditContract = () => {
    if (contract) {
      navigate(`/contracts/edit/${contract.id}`);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contract) return;
    
    try {
      setActionLoading(true);
      
      // Generate and save the PDF document
      const pdfUrl = await generateAndSaveContractPDF(contract.id);
      
      // Update local state with the new PDF URL
      setContract({
        ...contract,
        pdfUrl
      });
      
      // Check if the URL is a data URL (base64) or a storage URL
      if (pdfUrl.startsWith('data:')) {
        // For data URLs, create a download link and trigger it
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `contrato_${contract.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For storage URLs, open in a new tab
        window.open(pdfUrl, '_blank');
      }
      
      toast({
        title: "PDF generado con éxito",
        description: "El contrato se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF del contrato",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignContract = async (signedBy: 'client' | 'professional') => {
    if (!contract) return;
    
    try {
      setActionLoading(true);
      
      const updatedContract = await signContract(contract.id, signedBy);
      
      setContract(updatedContract);
      
      toast({
        title: "Contrato firmado",
        description: `El contrato ha sido firmado como ${signedBy === 'client' ? 'cliente' : 'profesional'}`,
      });
    } catch (error) {
      console.error("Error signing contract:", error);
      toast({
        title: "Error",
        description: "No se pudo firmar el contrato",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Borrador</Badge>;
      case "active":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Activo</Badge>;
      case "completed":
        return <Badge variant="secondary">Completado</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!contract || !client) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Contrato no encontrado</h2>
        <p className="text-muted-foreground mb-4">El contrato que buscas no existe o ha sido eliminado.</p>
        <Button onClick={() => navigate("/contracts")}>Volver a Contratos</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{contract.title}</CardTitle>
                <CardDescription className="mt-1">
                  Contrato para {client.name}{" "}
                  {client.company && `(${client.company})`}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(contract.status)}
                {contract.signedByClient && contract.signedByProfessional && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">Firmado</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Fechas</h3>
                <div className="space-y-1">
                  <p className="flex justify-between">
                    <span className="text-sm">Fecha de inicio:</span>
                    <span className="font-medium">
                      {format(new Date(contract.startDate), "d MMMM yyyy", { locale: es })}
                    </span>
                  </p>
                  {contract.endDate && (
                    <p className="flex justify-between">
                      <span className="text-sm">Fecha de finalización:</span>
                      <span className="font-medium">
                        {format(new Date(contract.endDate), "d MMMM yyyy", { locale: es })}
                      </span>
                    </p>
                  )}
                  {contract.signedAt && (
                    <p className="flex justify-between">
                      <span className="text-sm">Firmado el:</span>
                      <span className="font-medium">
                        {format(new Date(contract.signedAt), "d MMMM yyyy", { locale: es })}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Importes</h3>
                <div className="space-y-1">
                  <p className="flex justify-between">
                    <span className="text-sm">Primera fase:</span>
                    <span className="font-medium">{contract.phase1Fee.toLocaleString('es-ES')} €</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-sm">Cuota mensual:</span>
                    <span className="font-medium">{contract.monthlyFee.toLocaleString('es-ES')} €</span>
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Signatures */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Firmas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Cliente</p>
                    <p className="text-sm text-muted-foreground">{contract.content.clientInfo.name}</p>
                  </div>
                  {contract.signedByClient ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Profesional</p>
                    <p className="text-sm text-muted-foreground">{contract.content.professionalInfo.name}</p>
                  </div>
                  {contract.signedByProfessional ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Contract sections */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contenido del Contrato</h3>
              
              {contract.content.sections.map((section, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium">{index + 1}. {section.title}</h4>
                  <p className="text-sm whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-2 pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => navigate(`/clients/${contract.clientId}`)}
              >
                Volver al Cliente
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleEditContract}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!contract.signedByClient && (
                <Button 
                  variant="default" 
                  className="flex items-center gap-1"
                  onClick={() => handleSignContract('client')}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Firmar como Cliente
                </Button>
              )}
              
              {!contract.signedByProfessional && (
                <Button 
                  variant="default" 
                  className="flex items-center gap-1"
                  onClick={() => handleSignContract('professional')}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Firmar como Profesional
                </Button>
              )}
              
              <Button 
                variant="default" 
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleDownloadPDF}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Descargar PDF
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
