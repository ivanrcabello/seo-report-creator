import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Globe, Building, Phone, Save, Plus, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { saveLocalSeoSettings, getLocalSeoSettings } from "@/services/localSeo";

interface LocalSeoSettings {
  id?: string;
  clientId: string;
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
  targetLocations: string[];
}

interface LocalSeoSettingsFormProps {
  clientId: string;
  clientName: string;
  onSave?: (settings: LocalSeoSettings) => void;
}

export const LocalSeoSettingsForm: React.FC<LocalSeoSettingsFormProps> = ({
  clientId,
  clientName,
  onSave
}) => {
  const [settings, setSettings] = useState<LocalSeoSettings>({
    clientId,
    businessName: clientName,
    address: "",
    phone: "",
    website: "",
    googleBusinessUrl: "",
    targetLocations: []
  });
  
  const [newLocation, setNewLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    console.log("LocalSeoSettingsForm clientId:", clientId);
    if (clientId && clientId.trim() !== '') {
      fetchSettings();
    } else {
      console.error("Invalid clientId provided to LocalSeoSettingsForm");
      setIsLoading(false);
    }
  }, [clientId]);
  
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching settings for client ID:", clientId);
      const data = await getLocalSeoSettings(clientId);
      
      if (data) {
        console.log("Retrieved settings:", data);
        setSettings({
          id: data.id,
          clientId: data.client_id,
          businessName: data.business_name,
          address: data.address,
          phone: data.phone || "",
          website: data.website || "",
          googleBusinessUrl: data.google_business_url || "",
          targetLocations: data.target_locations || []
        });
      } else {
        console.log("No existing settings found, using defaults with clientId:", clientId);
        setSettings(prev => ({
          ...prev,
          clientId,
          businessName: clientName || prev.businessName
        }));
      }
    } catch (error) {
      console.error("Error fetching local SEO settings:", error);
      toast.error("Error loading local SEO settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    
    if (!settings.targetLocations.includes(newLocation.trim())) {
      setSettings(prev => ({
        ...prev,
        targetLocations: [...prev.targetLocations, newLocation.trim()]
      }));
    }
    
    setNewLocation("");
  };
  
  const handleRemoveLocation = (location: string) => {
    setSettings(prev => ({
      ...prev,
      targetLocations: prev.targetLocations.filter(loc => loc !== location)
    }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!clientId || clientId.trim() === '') {
        throw new Error("Client ID is required");
      }
      
      const settingsToSave = {
        ...settings,
        clientId
      };
      
      console.log("Saving settings:", settingsToSave);
      const result = await saveLocalSeoSettings(settingsToSave);
      
      if (result) {
        console.log("Settings saved successfully:", result);
        setSettings(prev => ({
          ...prev,
          id: result.id
        }));
        
        toast.success("Local SEO settings saved successfully");
        
        if (onSave) {
          onSave({
            id: result.id,
            clientId: result.client_id,
            businessName: result.business_name,
            address: result.address,
            phone: result.phone,
            website: result.website,
            googleBusinessUrl: result.google_business_url,
            targetLocations: result.target_locations
          });
        }
      }
    } catch (error) {
      console.error("Error saving local SEO settings:", error);
      toast.error("Error saving local SEO settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 flex justify-center items-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-green-500 rounded-full"></div>
            <p className="text-sm text-gray-500">Loading local SEO settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-xl">Configuración de SEO Local</CardTitle>
        <CardDescription>
          Configura la información de tu negocio para SEO local y las ubicaciones objetivo
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                Nombre del negocio
              </Label>
              <Input
                id="businessName"
                name="businessName"
                value={settings.businessName}
                onChange={handleChange}
                placeholder="Nombre del negocio o empresa"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Dirección principal
              </Label>
              <Textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="Dirección completa del negocio"
                required
                rows={2}
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
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
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
                  name="website"
                  value={settings.website}
                  onChange={handleChange}
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
                name="googleBusinessUrl"
                value={settings.googleBusinessUrl}
                onChange={handleChange}
                placeholder="URL del perfil de Google My Business"
                type="url"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: https://business.google.com/n/xxxxxxxxxxxxx
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2 border-t">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Ubicaciones objetivo para SEO local
            </Label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {settings.targetLocations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay ubicaciones configuradas</p>
              ) : (
                settings.targetLocations.map((location, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 py-1.5">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1 rounded-full"
                      onClick={() => handleRemoveLocation(location)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Añadir nueva ubicación (ej: Madrid, Barcelona, etc.)"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                type="button" 
                onClick={handleAddLocation}
                variant="outline"
                size="icon"
                disabled={!newLocation.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Añade las ciudades o zonas donde quieres que tu negocio sea encontrado en búsquedas locales.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving || !settings.businessName || !settings.address || !clientId}
            className="bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar configuración
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
