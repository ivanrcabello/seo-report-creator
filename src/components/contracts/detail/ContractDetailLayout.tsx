
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoContract, Client } from "@/types/client";
import { ContractActions } from "./ContractActions";
import { ContractContent } from "./ContractContent";
import { ContractHeader } from "./ContractHeader";
import { generateContractPDF, saveContractPDF } from "@/services/contract";
import { toast } from "sonner";

interface ContractDetailLayoutProps {
  contract: SeoContract;
  client: Client;
  onRefresh?: () => void;
}

interface ContractContentProps {
  contract: SeoContract;
}

interface ContractActionsProps {
  contractId: string;
  status?: string;
  onGeneratePdf: () => Promise<void>;
  onRefresh?: () => void;
}

export const ContractDetailLayout = ({ 
  contract, 
  client,
  onRefresh 
}: ContractDetailLayoutProps) => {
  const handleGeneratePDF = async () => {
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
    }
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
            status={contract.status}
            onGeneratePdf={handleGeneratePDF}
            onRefresh={onRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
};
