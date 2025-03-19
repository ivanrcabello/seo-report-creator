
import React from "react";
import { Building, Mail, Phone, User, Globe, Briefcase } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type BasicInfoSectionProps = {
  form: UseFormReturn<any>;
};

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
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

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-gray-700">
              <Globe className="h-4 w-4 text-seo-blue" />
              Página Web
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="URL del sitio web (opcional)" 
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
        name="sector"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-gray-700">
              <Briefcase className="h-4 w-4 text-seo-blue" />
              Sector
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Sector de la empresa (opcional)" 
                {...field} 
                className="border-gray-200 focus:border-seo-blue focus:ring-seo-blue/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
