
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSpeedScoreCards } from "./PageSpeedScoreCards";
import { PageSpeedMetricCards } from "./PageSpeedMetricCards";
import { PageSpeedPerformanceMetrics } from "./PageSpeedPerformanceMetrics";
import { PageSpeedAuditList } from "./PageSpeedAuditList";
import { PageSpeedReport } from "@/services/pagespeed";

interface PageSpeedReportTabsProps {
  pageSpeedReport: PageSpeedReport;
}

export const PageSpeedReportTabs = ({ pageSpeedReport }: PageSpeedReportTabsProps) => {
  return (
    <Tabs defaultValue="scores" className="mt-6">
      <TabsList>
        <TabsTrigger value="scores">Puntuaciones</TabsTrigger>
        <TabsTrigger value="metrics">Métricas</TabsTrigger>
        <TabsTrigger value="audits">Auditorías</TabsTrigger>
      </TabsList>
      
      <TabsContent value="scores">
        <PageSpeedScoreCards metrics={pageSpeedReport.metrics} />
      </TabsContent>
      
      <TabsContent value="metrics">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PageSpeedMetricCards metrics={pageSpeedReport.metrics} />
          </div>
          <PageSpeedPerformanceMetrics metrics={pageSpeedReport.metrics} />
        </div>
      </TabsContent>
      
      <TabsContent value="audits">
        <PageSpeedAuditList audits={pageSpeedReport.audits} />
      </TabsContent>
    </Tabs>
  );
};
