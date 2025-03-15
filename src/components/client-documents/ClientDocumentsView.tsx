
import React from "react";
import { ClientReport } from "@/types/client";
import { ShareableReportView } from "@/components/ShareableReportView";
import { Card, CardContent } from "@/components/ui/card";

interface ClientDocumentsViewProps {
  report: ClientReport;
}

const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ report }) => {
  return (
    <Card className="border-0 shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-seo-blue to-seo-purple text-white">
        <h2 className="text-xl font-bold">{report.title || "Informe"}</h2>
        <p className="text-white/80 text-sm mt-1">
          {new Date(report.date).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      <CardContent className="p-6">
        <ShareableReportView report={report} />
      </CardContent>
    </Card>
  );
};

export default ClientDocumentsView;
