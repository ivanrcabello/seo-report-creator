
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CompanySettingsForm = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Información de la Empresa</CardTitle>
        <CardDescription>
          Actualiza la información de tu empresa que aparecerá en todos los documentos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nombre de la Empresa</Label>
          <Input id="company-name" placeholder="Ingresa el nombre de tu empresa" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company-address">Dirección</Label>
          <Textarea id="company-address" placeholder="Dirección completa" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-email">Email</Label>
            <Input id="company-email" type="email" placeholder="contacto@empresa.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-phone">Teléfono</Label>
            <Input id="company-phone" placeholder="+34 123 456 789" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company-tax-id">NIF/CIF</Label>
          <Input id="company-tax-id" placeholder="B12345678" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto">Guardar Cambios</Button>
      </CardFooter>
    </Card>
  );
};

export default CompanySettingsForm;
