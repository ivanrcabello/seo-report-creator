
import { useState } from "react";
import { SeoContract } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CalendarDays, 
  FileText, 
  CheckCircle, 
  Download, 
  Building2, 
  User, 
  DollarSign,
  PenLine
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signContractByClient } from "@/services/contract";

interface ContractShareViewProps {
  contract: SeoContract;
  client: any;
}

export const ContractShareView = ({ contract, client }: ContractShareViewProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  const handleDownloadContract = () => {
    if (contract.pdfUrl) {
      window.open(contract.pdfUrl, '_blank');
    } else {
      toast.error("No hay PDF disponible para este contrato");
    }
  };

  const handleSignContract = async () => {
    setIsSigning(true);
    try {
      // Fix: Pass the client name as the second argument
      const success = await signContractByClient(contract.id, client?.name || "Cliente");
      if (success) {
        setSignSuccess(true);
        toast.success("Contrato firmado correctamente");
        // Update local contract state to reflect the signing
        contract.signedByClient = true;
        contract.signedAt = new Date().toISOString();
      } else {
        toast.error("Error al firmar el contrato");
      }
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Error al firmar el contrato");
    } finally {
      setIsSigning(false);
      setSignDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Contract Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{contract.title}</h1>
              <p className="mt-2 text-blue-100">
                Contrato compartido • {format(new Date(contract.startDate), "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
            <div className="flex gap-2">
              {!contract.signedByClient && (
                <Button
                  onClick={() => setSignDialogOpen(true)}
                  variant="secondary"
                  className="gap-2"
                >
                  <PenLine className="h-4 w-4" />
                  Firmar Contrato
                </Button>
              )}
              {contract.pdfUrl && (
                <Button
                  onClick={handleDownloadContract}
                  variant="secondary"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Client Badge */}
        {client && (
          <div className="flex justify-end -mt-4 mr-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
              Para: {client.name}
            </div>
          </div>
        )}
        
        <Card className="border-0 shadow-lg mt-6">
          <CardContent className="p-6">
            {/* Contract Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Cliente</h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">{client?.name || "N/A"}</span>
                </div>
                {client?.company && (
                  <div className="flex items-center gap-2 mt-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    <span>{client.company}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Detalles del contrato</h3>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-5 w-5 text-purple-600" />
                  <span>
                    Vigencia: {format(new Date(contract.startDate), "d MMM yyyy", { locale: es })}
                    {contract.endDate && ` - ${format(new Date(contract.endDate), "d MMM yyyy", { locale: es })}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span>
                    Pago inicial: {contract.phase1Fee.toLocaleString('es-ES')} € • 
                    Cuota mensual: {contract.monthlyFee.toLocaleString('es-ES')} €
                  </span>
                </div>
              </div>
            </div>
            
            {/* Contract Status */}
            <div className="mb-8">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-2 ${contract.signedByClient ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CheckCircle className={`h-6 w-6 ${contract.signedByClient ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm font-medium">Firmado por Cliente</p>
                  {contract.signedByClient && contract.signedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(contract.signedAt), "d MMM yyyy", { locale: es })}
                    </p>
                  )}
                </div>
                
                <div className="text-center">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-2 ${contract.signedByProfessional ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CheckCircle className={`h-6 w-6 ${contract.signedByProfessional ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm font-medium">Firmado por Profesional</p>
                  {contract.signedByProfessional && contract.signedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(contract.signedAt), "d MMM yyyy", { locale: es })}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Contract Content */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Contenido del Contrato
              </h2>
              
              {contract.content.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold">{index + 1}. {section.title}</h3>
                  <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">Profesional:</h4>
                  <p className="text-sm text-gray-600">{contract.content.professionalInfo.name}</p>
                </div>
                <div>
                  <h4 className="font-medium">Cliente:</h4>
                  <p className="text-sm text-gray-600">{contract.content.clientInfo.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sign Contract Dialog */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Firmar Contrato</DialogTitle>
            <DialogDescription>
              Al hacer clic en "Firmar", usted confirma que ha leído y acepta los términos y condiciones de este contrato.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md my-4">
            <p className="text-sm text-gray-700">
              Este documento constituye un acuerdo legalmente vinculante entre usted y {contract.content.professionalInfo.name}. 
              Su firma electrónica tiene el mismo valor legal que una firma física.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => setSignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSignContract}
              disabled={isSigning}
              className="gap-2"
            >
              {isSigning && <span className="animate-spin">⏳</span>}
              {isSigning ? "Firmando..." : "Firmar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
