
import React from "react";
import { ClientReport } from "@/types/client";
import { ShareableReportView } from "@/components/ShareableReportView";
import { Card, CardContent } from "@/components/ui/card";

interface ClientDocumentsViewProps {
  report: ClientReport;
}

const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ report }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <ShareableReportView report={report} />
      </CardContent>
    </Card>
  );
};

export default ClientDocumentsView;
