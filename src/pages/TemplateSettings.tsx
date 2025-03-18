
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TemplateSettings() {
  return (
    <div className="container mx-auto py-6">
      <SettingsNavigation />
      
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Plantillas de documentos</CardTitle>
          <CardDescription>
            Gestiona las plantillas para tus propuestas, contratos e informes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proposals">
            <TabsList className="mb-4">
              <TabsTrigger value="proposals">Propuestas</TabsTrigger>
              <TabsTrigger value="contracts">Contratos</TabsTrigger>
              <TabsTrigger value="reports">Informes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proposals" className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-3">Plantillas de propuestas</h3>
              <p className="text-muted-foreground mb-4">
                Estas plantillas se utilizan al generar nuevas propuestas para clientes.
              </p>
              <div className="text-center py-8">
                <p>Funcionalidad en desarrollo</p>
              </div>
            </TabsContent>
            
            <TabsContent value="contracts" className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-3">Plantillas de contratos</h3>
              <p className="text-muted-foreground mb-4">
                Personaliza las plantillas que se utilizan al generar contratos.
              </p>
              <div className="text-center py-8">
                <p>Funcionalidad en desarrollo</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-3">Plantillas de informes</h3>
              <p className="text-muted-foreground mb-4">
                Configura cómo se presentan los informes SEO a tus clientes.
              </p>
              <div className="text-center py-8">
                <p>Funcionalidad en desarrollo</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
