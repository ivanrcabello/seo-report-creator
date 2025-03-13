
import { ClientReport } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { ShareableReportView } from "./ShareableReportView";

interface ShareableReportProps {
  report: ClientReport;
}

export const ShareableReport = ({ report }: ShareableReportProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <ShareableReportView report={report} />
      </CardContent>
    </Card>
  );
};
