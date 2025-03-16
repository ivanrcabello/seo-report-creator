
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
import { Building, Mail, Phone, User, ArrowLeft, Save } from "lucide-react";

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
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
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
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-6 px-6">
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
