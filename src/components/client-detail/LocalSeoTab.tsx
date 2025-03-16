import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoLocalReport } from "@/types/client";
import { LocalSeoSettingsForm } from "@/components/client-detail/LocalSeoSettingsForm";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building, MapPin, Phone, Globe, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveBasicLocalSeoSettings, getLocalSeoSettings } from "@/services/localSeo";

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
  
  const [clientName, setClientName] = useState(currentLocalSeoReport?.businessName || '');
  const [address, setAddress] = useState(currentLocalSeoReport?.location || '');
  const [phone, setPhone] = useState(currentLocalSeoReport?.phone || '');
  const [website, setWebsite] = useState(currentLocalSeoReport?.website || '');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState(currentLocalSeoReport?.googleBusinessUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  console.log("LocalSeoTab - clientId:", clientId);
  console.log("LocalSeoTab - currentLocalSeoReport:", currentLocalSeoReport);
  
  useEffect(() => {
    if (client) {
      fetchSettings();
    }
  }, [client]);
  
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await getLocalSeoSettings(client);
      if (settings) {
        setClientName(settings.business_name || '');
        setAddress(settings.address || '');
        setPhone(settings.phone || '');
        setWebsite(settings.website || '');
        setGoogleBusinessUrl(settings.google_business_url || '');
      }
    } catch (error) {
      console.error("Error fetching local SEO settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveBasicSettings = async () => {
    if (!clientName || !address) {
      toast.error("Nombre del negocio y dirección son obligatorios");
      return;
    }
    
    setIsSaving(true);
    try {
      await saveBasicLocalSeoSettings(client, {
        businessName: clientName,
        address,
        phone,
        website,
        googleBusinessUrl
      });
      
      toast.success("Configuración básica guardada correctamente");
      setActiveTab('local-seo');
    } catch (error) {
      console.error("Error saving basic settings:", error);
      toast.error("Error al guardar la configuración básica");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="settings">Configuración Avanzada</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Información Básica SEO Local</CardTitle>
              <CardDescription>
                Configura la información esencial de tu negocio para SEO local
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  Nombre del negocio
                </Label>
                <Input
                  id="businessName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre del negocio o empresa"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Dirección principal
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección completa del negocio"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono del negocio"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    Sitio web
                  </Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="URL del sitio web"
                    type="url"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="googleBusinessUrl" className="flex items-center gap-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_My_Business_Logo.svg/512px-Google_My_Business_Logo.svg.png" 
                    alt="Google My Business" 
                    className="h-4 w-4"
                  />
                  Perfil de Google My Business
                </Label>
                <Input
                  id="googleBusinessUrl"
                  value={googleBusinessUrl}
                  onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                  placeholder="URL del perfil de Google My Business"
                  type="url"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: https://business.google.com/n/xxxxxxxxxxxxx
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveBasicSettings}
                disabled={isSaving || !clientName || !address}
                className="w-full bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar información básica
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <LocalSeoSettingsForm 
            clientId={client} 
            clientName={clientName}
            onSave={() => {
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
