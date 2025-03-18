
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Invoice } from "@/types/client";
import { getInvoices } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  Euro,
  Check,
  Clock,
  XCircle,
  Search,
  User,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientNames, setClientNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        const data = await getInvoices();
        setInvoices(data);
        
        // Cargar nombres de clientes
        const clientIds = Array.from(new Set(data.map(invoice => invoice.clientId)));
        const clientData: Record<string, string> = {};
        
        await Promise.all(
          clientIds.map(async (clientId) => {
            const client = await getClient(clientId);
            if (client) {
              clientData[clientId] = client.name;
            }
          })
        );
        
        setClientNames(clientData);
      } catch (error) {
        console.error("Error loading invoices:", error);
        toast.error("Error al cargar las facturas");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoices();
  }, []);

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
      default:
        return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const clientName = clientNames[invoice.clientId] || "";
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Facturas
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar facturas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/invoices/new")} className="gap-1">
              <Plus className="h-4 w-4" />
              Nueva Factura
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Cargando facturas...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No se encontraron facturas</p>
              <Button onClick={() => navigate("/invoices/new")} variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Crear Primera Factura
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        <span>{clientNames[invoice.clientId] || "Cliente desconocido"}</span>
                      </div>
                    </TableCell>
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
                          Ver Detalles
                        </Button>
                      </Link>
                      {invoice.pdfUrl && (
                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-3.5 w-3.5" />
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
    </div>
  );
};

export default Invoices;
