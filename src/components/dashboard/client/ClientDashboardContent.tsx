
import { ClientMetric } from "@/services/clientMetricsService";
import { ProjectTimeline } from "../ProjectTimeline";
import { ClientInvoicesWidget } from "../ClientInvoicesWidget";
import { SeoPerformanceCharts } from "../SeoPerformanceCharts";
import { DocumentCenter } from "../DocumentCenter";
import { ClientMetricsCards } from "./ClientMetricsCards";

interface ClientDashboardContentProps {
  metrics: ClientMetric | null;
}

export function ClientDashboardContent({ metrics }: ClientDashboardContentProps) {
  return (
    <>
      {metrics && (
        <ClientMetricsCards metrics={metrics} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProjectTimeline />
        </div>
        <ClientInvoicesWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SeoPerformanceCharts />
        </div>
        <DocumentCenter />
      </div>
    </>
  );
}
