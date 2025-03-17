
import { useContractForm } from "./ContractFormContext";
import { useContractFormData, useClients } from "./useContractFormData";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { GeneralInfoTab } from "./GeneralInfoTab";
import { PartiesTab } from "./PartiesTab";
import { SectionsTab } from "./SectionsTab";
import { useNavigate } from "react-router-dom";

export const ContractFormContent = () => {
  const { form, sections, setSections, loading, saving, clientId, contractId } = useContractForm();
  const { handleSubmit } = useContractFormData();
  const clients = useClients();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{contractId ? "Editar Contrato" : "Nuevo Contrato"}</CardTitle>
            <CardDescription>
              {contractId
                ? "Modifica los detalles del contrato existente"
                : "Crea un nuevo contrato de servicios SEO"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">Información General</TabsTrigger>
                <TabsTrigger value="parties">Partes del Contrato</TabsTrigger>
                <TabsTrigger value="sections">Secciones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <GeneralInfoTab form={form} clients={clients} clientId={clientId} />
              </TabsContent>
              
              <TabsContent value="parties">
                <PartiesTab form={form} />
              </TabsContent>
              
              <TabsContent value="sections">
                <SectionsTab sections={sections} onChange={setSections} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(clientId ? `/clients/${clientId}?tab=contracts` : "/contracts")}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>{contractId ? "Actualizar" : "Crear"} Contrato</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
