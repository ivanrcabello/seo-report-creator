
import { useState } from "react";
import { AuditResult } from "@/services/pdfAnalyzer";
import { AuditDetailsPanel } from "./AuditDetailsPanel";
import { MetricCard } from "./MetricCard";
import { TrendingUp, Globe, Search, BarChart2, Server, Share2 } from "lucide-react";

interface DashboardSummaryProps {
  auditResult?: AuditResult;
}

export const DashboardSummary = ({ auditResult }: DashboardSummaryProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const metrics = [
    {
      id: "seo",
      title: "Puntuación SEO",
      value: auditResult ? `${auditResult.seoScore}%` : "N/A",
      description: "Evaluación general del posicionamiento SEO del sitio web",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-50",
    },
    {
      id: "visibility",
      title: "Visibilidad Web",
      value: auditResult ? `${auditResult.webVisibility}%` : "N/A",
      description: "Presencia y alcance del sitio en internet",
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      id: "keywords",
      title: "Keywords",
      value: auditResult ? auditResult.keywordsCount : "N/A",
      description: "Cantidad de palabras clave relevantes identificadas",
      icon: <Search className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      id: "performance",
      title: "Rendimiento",
      value: auditResult ? `${auditResult.performance}%` : "N/A",
      description: "Velocidad y rendimiento general del sitio",
      icon: <BarChart2 className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-50",
    },
    {
      id: "technical",
      title: "Salud Técnica",
      value: auditResult ? "Ver detalles" : "N/A",
      description: "Estado de la configuración técnica del sitio",
      icon: <Server className="w-5 h-5 text-indigo-500" />,
      color: "bg-indigo-50",
    },
    {
      id: "social",
      title: "Presencia Social",
      value: auditResult ? "Ver detalles" : "N/A",
      description: "Integración con redes sociales y presencia online",
      icon: <Share2 className="w-5 h-5 text-pink-500" />,
      color: "bg-pink-50",
    },
  ];

  const handleCardClick = (id: string) => {
    setActiveTab(activeTab === id ? null : id);
  };

  if (!auditResult) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p className="text-lg">Sube un archivo PDF para ver el análisis detallado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Resultados del Análisis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            color={metric.color}
            className="cursor-pointer"
            onClick={() => handleCardClick(metric.id)}
          />
        ))}
      </div>

      {activeTab && (
        <AuditDetailsPanel 
          auditResult={auditResult} 
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
        />
      )}
    </div>
  );
};
