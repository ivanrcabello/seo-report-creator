
import { Card } from "@/components/ui/card";
import { TrendingUp, Globe, Search, BarChart2 } from "lucide-react";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AuditDetailsPanel } from "./AuditDetailsPanel";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardSummaryProps {
  auditResult?: AuditResult;
}

export const DashboardSummary = ({ auditResult }: DashboardSummaryProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const metrics = [
    {
      id: "seo",
      title: "Puntuación SEO",
      value: auditResult ? `${auditResult.seoScore}%` : "Pendiente",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: "visibility",
      title: "Visibilidad Web",
      value: auditResult ? `${auditResult.webVisibility}%` : "Pendiente",
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "keywords",
      title: "Keywords",
      value: auditResult ? `${auditResult.keywordsCount}` : "Pendiente",
      icon: Search,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "performance",
      title: "Rendimiento",
      value: auditResult ? `${auditResult.performance}%` : "Pendiente",
      icon: BarChart2,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  const handleCardClick = (id: string) => {
    setActiveTab(activeTab === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {auditResult ? "Resultados del Análisis" : "Resumen de Auditoría"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {metrics.map((metric) => (
          <Card 
            key={metric.id} 
            className={cn(
              "p-4 backdrop-blur-sm bg-white/50 border rounded-xl shadow-sm transition-all duration-300",
              activeTab === metric.id 
                ? "border-blue-500 shadow-md" 
                : "border-gray-200 hover:shadow-md",
              !auditResult && "opacity-70"
            )}
            onClick={auditResult ? () => handleCardClick(metric.id) : undefined}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {auditResult && activeTab && (
        <AuditDetailsPanel 
          auditResult={auditResult} 
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
        />
      )}
    </div>
  );
};
