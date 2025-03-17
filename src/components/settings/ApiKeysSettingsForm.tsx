
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getApiKeys, updateApiKeys, ApiKeys } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReloadIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

// Esquema de validación con Zod
const apiKeysSchema = z.object({
  openaiApiKey: z.string().min(1, "La clave API de OpenAI es requerida"),
});

type FormValues = z.infer<typeof apiKeysSchema>;

const ApiKeysSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Configuración del formulario con React Hook Form y Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      openaiApiKey: "",
    },
  });

  useEffect(() => {
    const loadApiKeys = async () => {
      setIsLoading(true);
      try {
        const apiKeys = await getApiKeys();
        if (apiKeys) {
          form.reset({
            openaiApiKey: apiKeys.openaiApiKey || "",
          });
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
        toast.error("No se pudieron cargar las claves API");
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeys();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      const apiKeys: ApiKeys = {
        openaiApiKey: values.openaiApiKey,
      };

      const result = await updateApiKeys(apiKeys);
      
      if (result) {
        toast.success("Claves API actualizadas correctamente");
      } else {
        throw new Error("No se pudieron actualizar las claves API");
      }
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast.error("Error al guardar las claves API");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Claves API</CardTitle>
        <CardDescription>
          Configura las claves de API necesarias para el funcionamiento de la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="openaiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clave API de OpenAI</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || isSaving}>
                {isSaving ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApiKeysSettingsForm;
