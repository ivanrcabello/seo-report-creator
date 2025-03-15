
import { ClientReport } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { ReportShareView } from "./ReportShareView";

interface ShareableReportProps {
  report: ClientReport;
}

export const ShareableReport = ({ report }: ShareableReportProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <ReportShareView report={report} />
      </CardContent>
    </Card>
  );
};
