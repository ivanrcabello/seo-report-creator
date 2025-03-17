import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeoContract, Client } from "@/types/client";
import { signContract, generateAndSaveContractPDF, deleteContract } from "@/services/contract";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ContractDetailProps {
  contract: SeoContract;
  client: Client;
}

export const ContractDetail = ({ contract, client }: ContractDetailProps) => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentContract, setCurrentContract] = useState<SeoContract>(contract);

  const handleEditContract = () => {
    navigate(`/contracts/edit/${currentContract.id}`);
  };

  const handleDownloadPDF = async () => {
    try {
      setActionLoading(true);
      
      const pdfUrl = await generateAndSaveContractPDF(currentContract.id);
      
      setCurrentContract({
        ...currentContract,
        pdfUrl
      });
      
      if (pdfUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `contrato_${currentContract.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(pdfUrl, '_blank');
      }
      
      uiToast({
        title: "PDF generado con éxito",
        description: "El contrato se ha descargado correctamente",
      });
    } catch (error) {
      console.error("Error downloading contract:", error);
      uiToast({
        title: "Error",
        description: "No se pudo generar el PDF del contrato",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignContract = async (signedBy: 'client' | 'professional') => {
    try {
      setActionLoading(true);
      
      const updatedContract = await signContract(currentContract.id, signedBy);
      
      setCurrentContract(updatedContract);
      
      uiToast({
        title: "Contrato firmado",
        description: `El contrato ha sido firmado como ${signedBy === 'client' ? 'cliente' : 'profesional'}`,
      });
    } catch (error) {
      console.error("Error signing contract:", error);
      uiToast({
        title: "Error",
        description: "No se pudo firmar el contrato",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!currentContract?.id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteContract(currentContract.id);
      
      if (success) {
        toast("Contrato eliminado correctamente", {
          description: "El contrato ha sido eliminado"
        });
        navigate("/contracts");
      } else {
        throw new Error("Error al eliminar el contrato");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast("Error al eliminar el contrato", {
        description: "No se pudo eliminar el contrato",
        style: { backgroundColor: 'red', color: 'white' }
      });
      setIsDeleting(false);
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

  if (!currentContract || !client) {
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
                <CardTitle className="text-2xl">{currentContract.title}</CardTitle>
                <CardDescription className="mt-1">
                  Contrato para {client.name}{" "}
                  {client.company && `(${client.company})`}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(currentContract.status)}
                {currentContract.signedByClient && currentContract.signedByProfessional && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">Firmado</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Fechas</h3>
                <div className="space-y-1">
                  <p className="flex justify-between">
                    <span className="text-sm">Fecha de inicio:</span>
                    <span className="font-medium">
                      {format(new Date(currentContract.startDate), "d MMMM yyyy", { locale: es })}
                    </span>
                  </p>
                  {currentContract.endDate && (
                    <p className="flex justify-between">
                      <span className="text-sm">Fecha de finalización:</span>
                      <span className="font-medium">
                        {format(new Date(currentContract.endDate), "d MMMM yyyy", { locale: es })}
                      </span>
                    </p>
                  )}
                  {currentContract.signedAt && (
                    <p className="flex justify-between">
                      <span className="text-sm">Firmado el:</span>
                      <span className="font-medium">
                        {format(new Date(currentContract.signedAt), "d MMMM yyyy", { locale: es })}
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
                    <span className="font-medium">{currentContract.phase1Fee.toLocaleString('es-ES')} €</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-sm">Cuota mensual:</span>
                    <span className="font-medium">{currentContract.monthlyFee.toLocaleString('es-ES')} €</span>
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Firmas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Cliente</p>
                    <p className="text-sm text-muted-foreground">{currentContract.content.clientInfo.name}</p>
                  </div>
                  {currentContract.signedByClient ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Profesional</p>
                    <p className="text-sm text-muted-foreground">{currentContract.content.professionalInfo.name}</p>
                  </div>
                  {currentContract.signedByProfessional ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contenido del Contrato</h3>
              
              {currentContract.content.sections.map((section, index) => (
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
                onClick={() => navigate(`/clients/${currentContract.clientId}?tab=contracts`)}
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
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-1"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El contrato será eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteContract}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!currentContract.signedByClient && (
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
              
              {!currentContract.signedByProfessional && (
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
