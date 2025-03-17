
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { Client } from "@/types/client";
import { getInvoiceByShareToken } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FileSpreadsheet, Building, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function InvoiceShare() {
  const { token } = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchInvoiceByToken = async () => {
    if (!token) {
      setError("No se proporcionó token de factura");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching invoice with token:", token);
      setLoading(true);
      setIsRetrying(false);
      
      const invoiceData = await getInvoiceByShareToken(token);
      
      if (!invoiceData) {
        setError("Factura no encontrada");
        setLoading(false);
        return;
      }
      
      setInvoice(invoiceData);
      
      // Get client information
      if (invoiceData.clientId) {
        const clientData = await getClient(invoiceData.clientId);
        setClient(clientData);
      }
      
      // Get company settings
      const companyData = await getCompanySettings();
      setCompany(companyData);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shared invoice:", error);
      setError("Error al cargar la factura");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceByToken();
  }, [token]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchInvoiceByToken();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: es });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-gray-200 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    const color = statusColors[status as keyof typeof statusColors] || statusColors.draft;
    
    return (
      <Badge className={color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-gray-600">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error || "No se pudo cargar la factura solicitada"}</p>
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleRetry} 
                  variant="outline"
                  disabled={isRetrying}
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-10 pb-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">No se encontró la factura solicitada</p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-6 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Factura {invoice.invoiceNumber}</CardTitle>
            </div>
            {getStatusBadge(invoice.status)}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Detalles de la Factura</CardTitle>
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
                              Servicios Profesionales
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
        </div>
        <div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Información de Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha de emisión</p>
                <p className="font-medium">{formatDate(invoice.issueDate)}</p>
              </div>
              
              {invoice.dueDate && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
              
              {invoice.paymentDate && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de pago</p>
                  <p className="font-medium">{formatDate(invoice.paymentDate)}</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Total a pagar</h4>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(invoice.totalAmount)}</p>
              </div>
              
              {company && company.bankAccount && (
                <div className="bg-blue-50 p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-1">Datos bancarios</h4>
                  <p className="text-sm">{company.bankAccount}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
