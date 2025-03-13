
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, User } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {client ? "Editar Cliente" : "Nuevo Cliente"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-blue-600" />
                    Nombre
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
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
                  <FormLabel className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email del cliente" {...field} />
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
                  <FormLabel className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Teléfono
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono (opcional)" {...field} />
                  </FormControl>
                  <FormDescription>
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
                  <FormLabel className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-blue-600" />
                    Empresa
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la empresa (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {client ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
