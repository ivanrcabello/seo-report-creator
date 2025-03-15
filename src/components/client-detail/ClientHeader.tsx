
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Client } from "@/types/client";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientHeaderProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ client, onEdit, onDelete }) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Link to="/clients" className="mr-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Ficha de Cliente</h1>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{client.name}</CardTitle>
            <CardDescription className="text-base">
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{client.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Cliente desde {format(new Date(client.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
              </div>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
