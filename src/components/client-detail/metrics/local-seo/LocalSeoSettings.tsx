
import { useState, useEffect } from "react";
import { X, Plus, Save, RefreshCcw, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSeoData, LocalSeoMetricsFormValues, localSeoMetricsSchema } from "./useLocalSeoData";

interface LocalSeoSettingsProps {
  clientId: string;
}

export const LocalSeoSettings = ({ clientId }: LocalSeoSettingsProps) => {
  const { 
    localSeoSettings, 
    targetLocations, 
    newLocation, 
    setNewLocation,
    handleAddLocation, 
    handleRemoveLocation, 
    handleKeyDown, 
    saveData, 
    isSaving,
    clientName
  } = useLocalSeoData(clientId, clientName);

  const form = useForm<LocalSeoMetricsFormValues>({
    resolver: zodResolver(localSeoMetricsSchema),
    defaultValues: {
      businessName: "",
      address: "",
      phone: "",
      website: "",
      googleBusinessUrl: "",
      googleMapsRanking: 0,
      googleReviewsCount: 0,
      googleReviewsAverage: 0,
      listingsCount: 0,
    },
  });

  useEffect(() => {
    if (localSeoSettings) {
      const reviewsAvg = typeof localSeoSettings.google_reviews_average === 'number' ? 
        localSeoSettings.google_reviews_average : 
        (parseFloat(localSeoSettings.google_reviews_average as unknown as string) || 0);
      
      form.reset({
        businessName: localSeoSettings.business_name || clientName,
        address: localSeoSettings.address || "",
        phone: localSeoSettings.phone || "",
        website: localSeoSettings.website || "",
        googleBusinessUrl: localSeoSettings.google_business_url || "",
        googleMapsRanking: localSeoSettings.google_maps_ranking || 0,
        googleReviewsCount: localSeoSettings.google_reviews_count || 0,
        googleReviewsAverage: reviewsAvg,
        listingsCount: localSeoSettings.listings_count || 0,
      });
    } else {
      form.reset({
        businessName: clientName,
        address: "",
        phone: "",
        website: "",
        googleBusinessUrl: "",
        googleMapsRanking: 0,
        googleReviewsCount: 0,
        googleReviewsAverage: 0,
        listingsCount: 0,
      });
    }
  }, [localSeoSettings, clientName, form]);

  const onSubmit = (data: LocalSeoMetricsFormValues) => {
    saveData(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configuración SEO Local</CardTitle>
        <CardDescription>
          Configura la información de tu negocio para SEO local y actualiza sus métricas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Información básica del negocio</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del negocio</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Nombre del negocio o empresa"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección principal</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Dirección completa del negocio"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Teléfono del negocio"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitio web</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="URL del sitio web"
                            type="url"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="googleBusinessUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perfil de Google My Business</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="URL del perfil de Google My Business"
                            type="url"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Ubicaciones objetivo para SEO local
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {targetLocations.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay ubicaciones configuradas</p>
                  ) : (
                    targetLocations.map((location, index) => (
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
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-sm font-medium">Métricas actuales de SEO local</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="googleMapsRanking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posición en Google Maps</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Ej: 3" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="googleReviewsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Reseñas en Google</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Ej: 25" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="googleReviewsAverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puntuación Media (0-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Ej: 4.5" 
                            step="0.1"
                            min="0"
                            max="5"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="listingsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Directorios</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="Ej: 10" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar configuración
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
