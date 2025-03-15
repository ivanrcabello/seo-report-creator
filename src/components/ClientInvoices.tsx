
import { useState } from "react";
import { Link } from "react-router-dom";
import { Invoice } from "@/types/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus,
  FileSpreadsheet,
  Calendar,
  Euro,
  Check,
  Clock,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientInvoicesProps {
  invoices: Invoice[];
  clientName?: string;
  clientId?: string;
  onAddInvoice?: () => void;
}

export const ClientInvoices = ({ invoices, clientName, clientId, onAddInvoice }: ClientInvoicesProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-normal gap-1">
            <Check className="h-3 w-3" />
            Pagada
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-normal gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-normal gap-1">
            <XCircle className="h-3 w-3" />
            Cancelada
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-normal gap-1">
            <FileText className="h-3 w-3" />
            Borrador
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          {clientName ? `Facturas de ${clientName}` : 'Facturas'}
        </CardTitle>
        {onAddInvoice && (
          <Button onClick={onAddInvoice} className="gap-1">
            <Plus className="h-4 w-4" />
            Nueva Factura
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No hay facturas disponibles</p>
            {onAddInvoice && (
              <Button onClick={onAddInvoice} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Crear Primera Factura
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">{format(new Date(invoice.issueDate), "d MMM yyyy", { locale: es })}</span>
                  </TableCell>
                  <TableCell>
                    {invoice.dueDate ? (
                      <span className="text-sm">{format(new Date(invoice.dueDate), "d MMM yyyy", { locale: es })}</span>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      <Euro className="h-3.5 w-3.5 text-gray-500" />
                      {formatCurrency(invoice.totalAmount)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/invoices/${invoice.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Factura
                      </Button>
                    </Link>
                    {invoice.pdfUrl && (
                      <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
