
import { ClientReport } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { ReportShareView } from "./ReportShareView";

interface ShareableReportProps {
  report: ClientReport;
}

export const ShareableReport = ({ report }: ShareableReportProps) => {
  return (
    <Card className="border shadow-md rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <ReportShareView report={report} />
      </CardContent>
    </Card>
  );
};
