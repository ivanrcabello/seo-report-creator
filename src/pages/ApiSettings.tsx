
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ApiSettings() {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApiKeys() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setOpenaiApiKey(data.openai_api_key || '');
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast.error('Error al cargar las claves API');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchApiKeys();
  }, []);

  const handleSaveKeys = async () => {
    try {
      setIsSaving(true);
      
      // Check if records exist first
      const { data: existingKeys } = await supabase
        .from('api_keys')
        .select('id')
        .limit(1);
      
      if (existingKeys && existingKeys.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('api_keys')
          .update({ openai_api_key: openaiApiKey })
          .eq('id', existingKeys[0].id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('api_keys')
          .insert([{ openai_api_key: openaiApiKey }]);
          
        if (error) throw error;
      }
      
      toast.success('Claves API guardadas correctamente');
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Error al guardar las claves API');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <SettingsNavigation />
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Claves API</CardTitle>
          <CardDescription>
            Configura las claves de acceso para servicios externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-sm text-muted-foreground">
                  Usada para generar reportes SEO y contenido con IA
                </p>
              </div>
              
              <Button 
                onClick={handleSaveKeys}
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? 'Guardando...' : 'Guardar configuración'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
