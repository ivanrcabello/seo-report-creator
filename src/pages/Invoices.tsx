
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const InvoiceTableSkeleton = () => (
  <div className="space-y-3">
    <div className="h-10 bg-gray-100 animate-pulse rounded w-full"></div>
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 animate-pulse rounded w-full"></div>
    ))}
  </div>
);

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading invoices - page ${page}, limit ${ITEMS_PER_PAGE}`);
      const { data, total } = await getInvoices(page, ITEMS_PER_PAGE);
      console.log(`Loaded ${data.length} invoices of ${total} total`);
      
      setInvoices(data);
      setTotalInvoices(total);
      
      // Load client names for display
      const clientIds = Array.from(new Set(data.map(invoice => invoice.clientId)));
      const clientData: Record<string, string> = {};
      
      await Promise.all(
        clientIds.map(async (clientId) => {
          if (!clientId) return;
          try {
            const client = await getClient(clientId);
            if (client) {
              clientData[clientId] = client.name;
            }
          } catch (err) {
            console.error(`Error fetching client ${clientId}:`, err);
          }
        })
      );
      
      setClientNames(clientData);
    } catch (error: any) {
      console.error("Error loading invoices:", error);
      setError(error.message || "Error al cargar las facturas");
      toast.error("Error al cargar las facturas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices(currentPage);
  }, [currentPage, loadInvoices]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  }, []);

  const getStatusBadge = useCallback((status: Invoice['status']) => {
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
            <FileSpreadsheet className="h-3 w-3" />
            Borrador
          </Badge>
        );
      default:
        return null;
    }
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < totalInvoices) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalInvoices]);

  const handleCreateInvoice = useCallback(() => {
    navigate("/invoices/new");
  }, [navigate]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const clientName = clientNames[invoice.clientId] || "";
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [invoices, clientNames, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(totalInvoices / ITEMS_PER_PAGE), [totalInvoices]);

  if (error) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-red-500 mb-4">
              <XCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error al cargar las facturas</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => loadInvoices(0)} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Button onClick={handleCreateInvoice} className="gap-1">
              <Plus className="h-4 w-4" />
              Nueva Factura
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <InvoiceTableSkeleton />
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No se encontraron facturas que coincidan con la búsqueda" : "No hay facturas disponibles"}
              </p>
              <Button onClick={handleCreateInvoice} variant="outline" className="gap-1">
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
        {!isLoading && filteredInvoices.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Mostrando {filteredInvoices.length} de {totalInvoices} facturas
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousPage} 
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage + 1} de {totalPages || 1}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={(currentPage + 1) * ITEMS_PER_PAGE >= totalInvoices}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Invoices;
