
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeoContract, Client } from "@/types/client";
import { 
  signContract, 
  generateAndSaveContractPDF, 
  shareContract 
} from "@/services/contract";
import { toast } from "sonner";
import { ContractHeader } from "./ContractHeader";
import { ContractContent } from "./ContractContent";
import { ContractActions } from "./ContractActions";
import { ShareDialog } from "./ShareDialog";
import { SignDialog } from "./SignDialog";

interface ContractDetailLayoutProps {
  contract: SeoContract;
  client: Client;
}

export const ContractDetailLayout = ({ contract, client }: ContractDetailLayoutProps) => {
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <ContractActions 
          contractId={contract.id}
          pdfUrl={contract.pdfUrl}
          signedByProfessional={contract.signedByProfessional}
          onShare={handleShareContract}
          onGeneratePdf={handleGeneratePdf}
          onSignOpen={() => setIsSignDialogOpen(true)}
          isLoading={isLoading}
          isPdfGenerating={isPdfGenerating}
        />
        
        <ContractHeader contract={contract} client={client} />
        <ContractContent contract={contract} />
      </div>

      <SignDialog 
        isOpen={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSign={handleSignContract}
        isLoading={isLoading}
      />

      <ShareDialog 
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
};
