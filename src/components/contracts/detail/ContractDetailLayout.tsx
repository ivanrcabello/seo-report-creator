
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoContract, Client } from "@/types/client";
import { ContractActions } from "./ContractActions";
import { ContractContent } from "./ContractContent";
import { ContractHeader } from "./ContractHeader";
import { generateContractPDF, saveContractPDF } from "@/services/contract";
import { toast } from "sonner";
import { useState } from "react";

interface ContractDetailLayoutProps {
  contract: SeoContract;
  client: Client;
  onRefresh?: () => void;
}

export const ContractDetailLayout = ({ 
  contract, 
  client,
  onRefresh 
}: ContractDetailLayoutProps) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const handleGeneratePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdfBlob = await generateContractPDF(contract);
      const url = await saveContractPDF(contract.id, pdfBlob);
      
      if (url && onRefresh) {
        toast.success("PDF generado correctamente");
        onRefresh();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Dummy handlers for other actions to satisfy ContractActions props
  const handleShare = async () => {
    toast.info("Compartir contrato - Funcionalidad en desarrollo");
  };

  const handleSignOpen = () => {
    toast.info("Firmar contrato - Funcionalidad en desarrollo");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <ContractHeader contract={contract} client={client} />
        </CardHeader>
        <CardContent>
          <ContractContent contract={contract} />
        </CardContent>
      </Card>
        
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractActions 
            contractId={contract.id}
            pdfUrl={contract.pdfUrl}
            signedByProfessional={contract.signedByProfessional}
            onGeneratePdf={handleGeneratePDF}
            onShare={handleShare}
            onSignOpen={handleSignOpen}
            isLoading={false}
            isPdfGenerating={isGeneratingPdf}
            onRefresh={onRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
};
