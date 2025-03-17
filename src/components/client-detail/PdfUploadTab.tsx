
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PdfUploader } from "@/components/PdfUploader";
import { UploadCloud } from "lucide-react";
import { AuditResult } from "@/services/pdfAnalyzer";

interface PdfUploadTabProps {
  clientId: string;
  clientName?: string;
  onAnalysisComplete?: (result: AuditResult) => void;
}

export const PdfUploadTab: React.FC<PdfUploadTabProps> = ({ 
  clientId, 
  clientName, 
  onAnalysisComplete 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-blue-600" />
          Subir informe PDF
        </CardTitle>
        <CardDescription>
          Sube un PDF de auditoría para analizar y generar automáticamente un informe para {clientName || "este cliente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PdfUploader onAnalysisComplete={onAnalysisComplete} />
      </CardContent>
    </Card>
  );
};
