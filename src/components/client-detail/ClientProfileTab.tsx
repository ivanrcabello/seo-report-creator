
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Client } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientProfileTabProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
}

export const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Nombre</h3>
            <p>{client.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Email</h3>
            <p>{client.email}</p>
          </div>
          {client.phone && (
            <div>
              <h3 className="font-medium text-gray-700">Teléfono</h3>
              <p>{client.phone}</p>
            </div>
          )}
          {client.company && (
            <div>
              <h3 className="font-medium text-gray-700">Empresa</h3>
              <p>{client.company}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-700">Fecha de registro</h3>
            <p>{format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Último informe</h3>
            <p>{client.lastReport ? format(new Date(client.lastReport), "d 'de' MMMM, yyyy", { locale: es }) : "Sin informes"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
