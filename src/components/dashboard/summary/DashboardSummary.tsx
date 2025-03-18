
import { ClientMetric } from "@/services/clientMetricsService";
import { DashboardMetrics } from "../metrics/DashboardMetrics";
import { ProjectTimeline } from "../ProjectTimeline";
import { ClientInvoicesWidget } from "../ClientInvoicesWidget";
import { SeoPerformanceCharts } from "../SeoPerformanceCharts";
import { DocumentCenter } from "../DocumentCenter";

interface DashboardSummaryProps {
  metrics: ClientMetric | null;
}

export function DashboardSummary({ metrics }: DashboardSummaryProps) {
  return (
    <>
      <DashboardMetrics metrics={metrics} />

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
