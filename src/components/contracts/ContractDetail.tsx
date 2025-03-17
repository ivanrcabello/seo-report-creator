
import { useState } from "react";
import { SeoContract, Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Download, 
  CalendarDays, 
  Building2, 
  FileText, 
  ArrowLeft,
  PenLine,
  Share2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { signContract, generateAndSaveContractPDF, shareContract } from "@/services/contract";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ContractDetailProps {
  contract: SeoContract;
  client: Client;
}

export const ContractDetail = ({ contract, client }: ContractDetailProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleSignContract = async () => {
    setIsLoading(true);
    try {
      await signContract(contract.id, 'professional');
      toast.success("Contrato firmado correctamente");
      // Refresh page to see updates
      navigate(0);
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Error al firmar el contrato");
    } finally {
      setIsLoading(false);
      setIsSignDialogOpen(false);
    }
  };

  const handleGeneratePdf = async () => {
    setIsPdfGenerating(true);
    try {
      const pdfUrl = await generateAndSaveContractPDF(contract.id);
      if (pdfUrl) {
        toast.success("PDF generado correctamente");
        window.open(pdfUrl, "_blank");
        // Refresh page to see updates
        navigate(0);
      } else {
        toast.error("Error al generar el PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleShareContract = async () => {
    setIsLoading(true);
    try {
      const result = await shareContract(contract.id);
      if (result && result.url) {
        setShareUrl(result.url);
        setIsShareDialogOpen(true);
      } else {
        toast.error("Error al compartir el contrato");
      }
    } catch (error) {
      console.error("Error sharing contract:", error);
      toast.error("Error al compartir el contrato");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between mb-6">
          <Button variant="outline" asChild>
            <Link to="/contracts" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Contratos
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleShareContract} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button 
              variant={contract.pdfUrl ? "outline" : "default"} 
              onClick={handleGeneratePdf} 
              disabled={isPdfGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isPdfGenerating ? "Generando..." : (contract.pdfUrl ? "Descargar PDF" : "Generar PDF")}
            </Button>
            {!contract.signedByProfessional && (
              <Button 
                onClick={() => setIsSignDialogOpen(true)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <PenLine className="h-4 w-4" />
                Firmar como Profesional
              </Button>
            )}
          </div>
        </div>
      
        {/* Contract Header */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{contract.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Contrato ID: {contract.id.substring(0, 8)}
                </p>
              </div>
              <Badge className={
                contract.status === 'active' ? "bg-green-100 text-green-800" :
                contract.status === 'completed' ? "bg-blue-100 text-blue-800" :
                contract.status === 'cancelled' ? "bg-red-100 text-red-800" :
                "bg-gray-100 text-gray-800"
              }>
                {contract.status === 'active' ? "Activo" :
                 contract.status === 'completed' ? "Completado" :
                 contract.status === 'cancelled' ? "Cancelado" :
                 "Borrador"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">{client.name}</span>
                </div>
                {client.company && (
                  <p className="text-gray-600 mt-1 ml-7">{client.company}</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Periodo</h3>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-purple-600" />
                  <div>
                    <p>Inicio: {format(new Date(contract.startDate), "d MMMM yyyy", { locale: es })}</p>
                    {contract.endDate && (
                      <p>Fin: {format(new Date(contract.endDate), "d MMMM yyyy", { locale: es })}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Honorarios</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">Fase Inicial: {contract.phase1Fee.toLocaleString('es-ES')} €</p>
                  <p className="font-medium">Cuota Mensual: {contract.monthlyFee.toLocaleString('es-ES')} €</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Estado de Firmas</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${contract.signedByProfessional ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircle className={`h-4 w-4 ${contract.signedByProfessional ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm">Profesional</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${contract.signedByClient ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircle className={`h-4 w-4 ${contract.signedByClient ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <span className="text-sm">Cliente</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contract Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Contenido del Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {contract.content.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-3">{index + 1}. {section.title}</h3>
                  <div className="whitespace-pre-line text-gray-700">{section.content}</div>
                  {index < contract.content.sections.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Signatures */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h4 className="font-medium mb-2">Profesional:</h4>
                  <p className="text-gray-600">{contract.content.professionalInfo.name}</p>
                  <p className="text-gray-600">{contract.content.professionalInfo.company}</p>
                  <p className="text-gray-600 text-sm mt-1">{contract.content.professionalInfo.taxId}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cliente:</h4>
                  <p className="text-gray-600">{contract.content.clientInfo.name}</p>
                  {contract.content.clientInfo.company && (
                    <p className="text-gray-600">{contract.content.clientInfo.company}</p>
                  )}
                  {contract.content.clientInfo.taxId && (
                    <p className="text-gray-600 text-sm mt-1">{contract.content.clientInfo.taxId}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sign Contract Dialog */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Firmar Contrato</DialogTitle>
            <DialogDescription>
              Al firmar este contrato, confirmas que estás de acuerdo con todos los términos y condiciones especificados.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-amber-50 rounded-md my-4 border border-amber-100">
            <p className="text-sm text-amber-800">
              Esta acción no se puede deshacer. La firma quedará registrada con fecha y hora actual.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSignContract}
              disabled={isLoading}
            >
              {isLoading ? "Firmando..." : "Firmar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Contract Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir Contrato</DialogTitle>
            <DialogDescription>
              Comparte este enlace con tu cliente para que pueda ver y firmar el contrato.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              value={shareUrl || ""}
              readOnly
              className="flex-1"
            />
            <Button type="submit" onClick={copyToClipboard}>
              Copiar
            </Button>
          </div>
          <div className="p-4 bg-blue-50 rounded-md my-4 border border-blue-100">
            <p className="text-sm text-blue-800">
              El cliente podrá ver y firmar el contrato usando este enlace. No se requiere inicio de sesión.
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsShareDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
