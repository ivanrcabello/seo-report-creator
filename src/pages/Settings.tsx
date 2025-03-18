
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";
import { ApiKeysSettingsForm } from "@/components/settings/ApiKeysSettingsForm";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <SettingsNavigation />
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanySettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api_keys">
          <Card>
            <CardHeader>
              <CardTitle>Claves de API</CardTitle>
            </CardHeader>
            <CardContent>
              <ApiKeysSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gestiona las plantillas utilizadas para informes, propuestas y otros documentos.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
