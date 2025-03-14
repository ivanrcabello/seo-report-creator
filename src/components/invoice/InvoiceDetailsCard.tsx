
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Building, User } from "lucide-react";
import { Invoice, CompanySettings } from "@/types/invoice";
import { Client } from "@/types/client";

interface InvoiceDetailsCardProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  packName: string | null;
  formatCurrency: (amount: number) => string;
}

export const InvoiceDetailsCard = ({
  invoice,
  client,
  company,
  packName,
  formatCurrency
}: InvoiceDetailsCardProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          Detalles de la Factura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
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
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Conceptos</h3>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Concepto</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {packName ? packName : "Servicios Profesionales"}
                      </p>
                      {invoice.notes && <p className="text-sm text-gray-500 mt-1">{invoice.notes}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(invoice.baseAmount)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-right text-sm font-medium text-gray-600">Base Imponible</td>
                  <td className="px-4 py-2 text-right font-medium">
                    {formatCurrency(invoice.baseAmount)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                    IVA ({invoice.taxRate}%)
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {formatCurrency(invoice.taxAmount)}
                  </td>
                </tr>
                <tr className="bg-gray-50 border-t">
                  <td className="px-4 py-3 text-right text-base font-semibold text-gray-800">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
