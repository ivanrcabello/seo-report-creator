
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoLocalReport } from "@/types/client";
import { LocalSeoSettingsForm } from "@/components/client-detail/LocalSeoSettingsForm";
import { useParams } from "react-router-dom";

interface LocalSeoTabProps {
  isGeneratingReport: boolean;
  localSeoReports: SeoLocalReport[];
  currentLocalSeoReport: SeoLocalReport | null;
  setCurrentLocalSeoReport: (report: SeoLocalReport) => void;
  setActiveTab: (tab: string) => void;
}

export const LocalSeoTab: React.FC<LocalSeoTabProps> = ({
  isGeneratingReport,
  localSeoReports,
  currentLocalSeoReport,
  setCurrentLocalSeoReport,
  setActiveTab
}) => {
  const { clientId } = useParams<{ clientId: string }>();
  const client = clientId || '';
  
  // Use client's business name from current report if available
  const clientName = currentLocalSeoReport?.businessName || '';
  
  console.log("LocalSeoTab - clientId:", clientId);
  console.log("LocalSeoTab - currentLocalSeoReport:", currentLocalSeoReport);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <LocalSeoSettingsForm 
            clientId={client} 
            clientName={clientName}
            onSave={() => {
              // Refresh reports after saving
              setActiveTab('local-seo');
            }}
          />
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Informes de SEO Local</h3>
            <p className="text-gray-500 mt-2">
              Esta sección mostrará los informes de SEO local generados.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Métricas de SEO Local</h3>
            <p className="text-gray-500 mt-2">
              Aquí se mostrarán las métricas y estadísticas de SEO local.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
