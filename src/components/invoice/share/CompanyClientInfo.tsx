
import { Building, User } from "lucide-react";
import { Client } from "@/types/client";
import { CompanySettings } from "@/types/invoice";

interface CompanyClientInfoProps {
  company: CompanySettings | null;
  client: Client | null;
}

export const CompanyClientInfo = ({ company, client }: CompanyClientInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between border-b pb-6">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg font-semibold flex items-center gap-1 mb-2">
          <Building className="h-4 w-4 text-gray-500" />
          Datos del Emisor
        </h3>
        {company ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium">{company.companyName}</p>
            <p>CIF/NIF: {company.taxId}</p>
            <p>{company.address}</p>
            {company.phone && <p>Tel: {company.phone}</p>}
            {company.email && <p>Email: {company.email}</p>}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay datos de la empresa configurados</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-1 mb-2">
          <User className="h-4 w-4 text-gray-500" />
          Datos del Cliente
        </h3>
        {client ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium">{client.name}</p>
            {client.company && <p>{client.company}</p>}
            <p>Email: {client.email}</p>
            {client.phone && <p>Tel: {client.phone}</p>}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Cliente no encontrado</p>
        )}
      </div>
    </div>
  );
};
