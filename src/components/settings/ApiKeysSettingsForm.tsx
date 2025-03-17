
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Key, Save, RefreshCcw, EyeOff, Eye } from "lucide-react";
import { getApiKeys, updateApiKeys } from "@/services/settingsService";

// Schema de validación para las claves API
const apiKeysSchema = z.object({
  openaiApiKey: z.string().min(1, "La clave API de OpenAI es requerida"),
});

type FormValues = z.infer<typeof apiKeysSchema>;

const ApiKeysSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      openaiApiKey: "",
    },
  });

  // Cargar las claves API actuales
  useEffect(() => {
    const loadApiKeys = async () => {
      setIsLoading(true);
      try {
        const keys = await getApiKeys();
        if (keys && keys.openaiApiKey) {
          form.setValue("openaiApiKey", keys.openaiApiKey);
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

  // Envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await updateApiKeys(data);
      toast.success("Claves API guardadas correctamente");
    } catch (error) {
      console.error("Error saving API keys:", error);
      toast.error("Error al guardar las claves API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          Configuración de Claves API
        </CardTitle>
        <CardDescription>
          Configura las claves API necesarias para conectar con servicios externos
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="sk-..."
                        {...field}
                        type={showApiKey ? "text" : "password"}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormDescription>
                    Esta clave se utiliza para generar informes con OpenAI. Consíguela en{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      platform.openai.com/api-keys
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Claves API
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApiKeysSettingsForm;
