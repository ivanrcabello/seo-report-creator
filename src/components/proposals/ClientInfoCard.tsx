
import React from "react";
import { Link } from "react-router-dom";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Briefcase } from "lucide-react";

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
          <p className="font-medium">{client.name}</p>
        </div>
        {client.company && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
            <p>{client.company}</p>
          </div>
        )}
        {client.sector && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-seo-blue" />
              Sector
            </h3>
            <p>{client.sector}</p>
          </div>
        )}
        {client.website && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-seo-blue" />
              Página Web
            </h3>
            <p>
              <a 
                href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {client.website}
              </a>
            </p>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p>{client.email}</p>
        </div>
        {client.phone && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
            <p>{client.phone}</p>
          </div>
        )}
        <div className="pt-2">
          <Link to={`/clients/${client.id}`}>
            <Button variant="outline" className="w-full">
              Ver Perfil del Cliente
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
