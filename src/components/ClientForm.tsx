
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Mail, Phone, User, ArrowLeft, Save, Power } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "lastReport">) => void;
  onCancel: () => void;
}

export const ClientForm = ({ client, onSubmit, onCancel }: ClientFormProps) => {
  const form = useForm({
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      company: client?.company || "",
      isActive: client?.isActive ?? true,
    },
  });

  const [analyticsConnected, setAnalyticsConnected] = useState(client?.analyticsConnected ?? false);
  const [searchConsoleConnected, setSearchConsoleConnected] = useState(client?.searchConsoleConnected ?? false);
  
  const handleSubmit = (data: any) => {
    // Include the analytics and search console states in the submission
    const formData = {
      ...data,
      analyticsConnected,
      searchConsoleConnected,
    };
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
        <CardTitle className="text-xl bg-gradient-to-r from-seo-blue to-seo-purple bg-clip-text text-transparent">
          {client ? "Editar Cliente" : "Nuevo Cliente"}
        </CardTitle>
        <CardDescription>
          {client 
            ? "Actualiza la información del cliente" 
            : "Completa el formulario para crear un nuevo cliente"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-5">
              <h3 className="text-base font-medium text-gray-800">Información básica</h3>
              
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "El nombre es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-gray-700">
                      <User className="h-4 w-4 text-seo-blue" />
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre del cliente" 
                        {...field} 
                        className="border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de email inválida"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-gray-700">
                      <Mail className="h-4 w-4 text-seo-blue" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email del cliente" 
                        {...field} 
                        className="border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-gray-700">
                      <Phone className="h-4 w-4 text-seo-blue" />
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Teléfono (opcional)" 
                        {...field} 
                        className="border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Formato recomendado: +34 XXX XXX XXX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-gray-700">
                      <Building className="h-4 w-4 text-seo-blue" />
                      Empresa
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre de la empresa (opcional)" 
                        {...field} 
                        className="border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-5 space-y-5">
              <h3 className="text-base font-medium text-gray-800">Estado y conexiones</h3>
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2 text-base">
                        <Power className="h-4 w-4 text-seo-blue" />
                        Estado del cliente
                      </FormLabel>
                      <FormDescription>
                        Determina si el cliente está activo o inactivo en la plataforma
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2 text-base">
                    Google Analytics
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    ¿El cliente tiene conectada su cuenta de Google Analytics?
                  </div>
                </div>
                <Switch
                  checked={analyticsConnected}
                  onCheckedChange={setAnalyticsConnected}
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2 text-base">
                    Google Search Console
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    ¿El cliente tiene conectada su cuenta de Search Console?
                  </div>
                </div>
                <Switch
                  checked={searchConsoleConnected}
                  onCheckedChange={setSearchConsoleConnected}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-6 px-6 border-t bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              {client ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
