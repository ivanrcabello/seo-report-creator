
import React from "react";
import { Server, Code, Lock } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";

type CredentialsAccordionProps = {
  form: UseFormReturn<any>;
};

export const CredentialsAccordion = ({ form }: CredentialsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hosting-access">
        <AccordionTrigger className="flex gap-2 text-md font-medium text-gray-800">
          <Server className="h-4 w-4 text-seo-blue" />
          Acceso al Hosting
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="hostingUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del panel</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="URL del panel de hosting" 
                    {...field} 
                    className="border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hostingUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Usuario" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hostingPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="wordpress-access">
        <AccordionTrigger className="flex gap-2 text-md font-medium text-gray-800">
          <Code className="h-4 w-4 text-seo-blue" />
          Acceso a WordPress
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="wordpressUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del admin</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="URL del panel de WordPress" 
                    {...field} 
                    className="border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="wordpressUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Usuario" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wordpressPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="project-passwords">
        <AccordionTrigger className="flex gap-2 text-md font-medium text-gray-800">
          <Lock className="h-4 w-4 text-seo-blue" />
          Otras Credenciales del Proyecto
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="ftpServer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servidor FTP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Servidor FTP" 
                    {...field} 
                    className="border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ftpUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario FTP</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Usuario FTP" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ftpPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña FTP</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña FTP" 
                      {...field} 
                      className="border-gray-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
