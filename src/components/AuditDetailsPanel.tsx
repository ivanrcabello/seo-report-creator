
import { Card } from "@/components/ui/card";
import { AuditResult } from "@/services/pdfAnalyzer";
import { Button } from "./ui/button";
import { SeoDetailsPanel } from "./audit-details/SeoDetailsPanel";
import { TechnicalDetailsPanel } from "./audit-details/TechnicalDetailsPanel";
import { PerformanceDetailsPanel } from "./audit-details/PerformanceDetailsPanel";
import { SocialDetailsPanel } from "./audit-details/SocialDetailsPanel";

interface AuditDetailsPanelProps {
  auditResult: AuditResult;
  activeTab: string;
  onClose: () => void;
}

export const AuditDetailsPanel = ({ auditResult, activeTab, onClose }: AuditDetailsPanelProps) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'seo':
        return <SeoDetailsPanel seoResults={auditResult.seoResults} />;
      case 'visibility':
      case 'technical':
        return <TechnicalDetailsPanel technicalResults={auditResult.technicalResults} />;
      case 'performance':
        return <PerformanceDetailsPanel performanceResults={auditResult.performanceResults} />;
      case 'keywords':
      case 'social':
        return <SocialDetailsPanel 
          socialPresence={auditResult.socialPresence} 
          keywordsCount={auditResult.keywordsCount}
        />;
      default:
        return null;
    }
  };

  return (
    <Card className="animate-fadeIn border border-gray-200 rounded-xl shadow-md">
      {renderTabContent()}
      <div className="flex justify-end p-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Card>
  );
};
