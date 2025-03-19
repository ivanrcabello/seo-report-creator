
import React from "react";
import { Client } from "@/types/client";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useClientForm } from "./client-form/useClientForm";
import { BasicInfoSection } from "./client-form/FormSections";
import { CredentialsAccordion } from "./client-form/CredentialsAccordion";
import { StatusConnections } from "./client-form/StatusConnections";
import { FormFooter } from "./client-form/FormFooter";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "lastReport">) => void;
  onCancel: () => void;
}

export const ClientForm = ({ client, onSubmit, onCancel }: ClientFormProps) => {
  const { 
    form, 
    analyticsConnected, 
    setAnalyticsConnected, 
    searchConsoleConnected, 
    setSearchConsoleConnected,
    formatFormData
  } = useClientForm(client);

  const handleSubmit = (data: any) => {
    const formattedData = formatFormData(data);
    onSubmit(formattedData);
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
            <BasicInfoSection form={form} />

            <div className="border-t pt-5 space-y-5">
              <CredentialsAccordion form={form} />
            </div>

            <div className="border-t pt-5">
              <StatusConnections 
                form={form}
                analyticsConnected={analyticsConnected}
                setAnalyticsConnected={setAnalyticsConnected}
                searchConsoleConnected={searchConsoleConnected}
                setSearchConsoleConnected={setSearchConsoleConnected}
              />
            </div>
          </CardContent>
          <CardFooter>
            <FormFooter client={client} onCancel={onCancel} />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
