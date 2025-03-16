
import { PageSpeedAudit } from "@/services/pagespeed";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditStats } from "./audit/AuditStats";
import { AuditFilter } from "./audit/AuditFilter";
import { AuditTabContent } from "./audit/AuditTabContent";

interface PageSpeedAuditListProps {
  audits: PageSpeedAudit[];
}

export const PageSpeedAuditList = ({ audits }: PageSpeedAuditListProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  const filteredAudits = audits.filter(
    audit => filter === 'all' || audit.category === filter
  );
  
  const passedAudits = filteredAudits.filter(audit => audit.score >= 0.9);
  const improvementAudits = filteredAudits.filter(audit => audit.score < 0.9 && audit.score >= 0.5);
  const failedAudits = filteredAudits.filter(audit => audit.score < 0.5);
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Auditorías</h3>
          <AuditFilter filter={filter} onFilterChange={setFilter} />
        </div>
        
        <AuditStats 
          passedCount={passedAudits.length} 
          improvementCount={improvementAudits.length} 
          failedCount={failedAudits.length} 
        />
      </div>
      
      <Tabs defaultValue="failed" className="w-full">
        <TabsList>
          <TabsTrigger value="failed">Fallidas</TabsTrigger>
          <TabsTrigger value="improvement">A mejorar</TabsTrigger>
          <TabsTrigger value="passed">Correctas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="failed">
          <AuditTabContent 
            audits={failedAudits} 
            emptyMessage="No hay auditorías fallidas en esta categoría" 
          />
        </TabsContent>
        
        <TabsContent value="improvement">
          <AuditTabContent 
            audits={improvementAudits} 
            emptyMessage="No hay auditorías a mejorar en esta categoría" 
          />
        </TabsContent>
        
        <TabsContent value="passed">
          <AuditTabContent 
            audits={passedAudits} 
            emptyMessage="No hay auditorías correctas en esta categoría" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
