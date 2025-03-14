
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Invoice, Client, CompanySettings } from "@/types/client";
import { getInvoice, markInvoiceAsPaid, deleteInvoice } from "@/services/invoiceService";
import { getClient } from "@/services/clientService";
import { getCompanySettings } from "@/services/settingsService";
import { getSeoPack } from "@/services/packService";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  FileText, 
  Euro, 
  Calendar, 
  Building, 
  User, 
  Check, 
  Clock, 
  XCircle, 
  Download 
} from "lucide-react";

export const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [packName, setPackName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Cargar factura
        const invoiceData = await getInvoice(id);
        if (!invoiceData) {
          toast.error("Factura no encontrada");
          navigate("/invoices");
          return;
        }
        
        setInvoice(invoiceData);
        
        // Cargar datos del cliente
        if (invoiceData.clientId) {
          const clientData = await getClient(invoiceData.clientId);
          if (clientData) {
            setClient(clientData);
          }
        }
        
        // Cargar datos de la empresa
        const companyData = await getCompanySettings();
        if (companyData) {
          setCompany(companyData);
        }
        
        // Cargar nombre del paquete si existe
        if (invoiceData.packId) {
          const packData = await getSeoPack(invoiceData.packId);
          if (packData) {
            setPackName(packData.name);
          }
        }
      } catch (error) {
        console.error("Error loading invoice details:", error);
        toast.error("Error al cargar los datos de la factura");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoiceData();
  }, [id, navigate]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const success = await deleteInvoice(id);
      if (success) {
        toast.success("Factura eliminada correctamente");
        navigate("/invoices");
      } else {
        throw new Error("No se pudo eliminar la factura");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Error al eliminar la factura");
    }
  };
  
  const handleMarkAsPaid = async () => {
    if (!id || !invoice) return;
    
    try {
      const updatedInvoice = await markInvoiceAsPaid(id);
      if (updatedInvoice) {
        setInvoice(updatedInvoice);
        toast.success("Factura marcada como pagada");
      } else {
        throw new Error("No se pudo actualizar el estado de la factura");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Error al actualizar el estado de la factura");
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
  };
  
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-normal gap-1">
            <Check className="h-3.5 w-3.5" />
            Pagada
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-normal gap-1">
            <Clock className="h-3.5 w-3.5" />
            Pendiente
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-normal gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Cargando factura...</h1>
        </div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/invoices")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Factura no encontrada</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              Factura {invoice.invoiceNumber}
            </h1>
            {getStatusBadge(invoice.status)}
          </div>
          
          <div className="flex items-center space-x-2">
            {invoice.status === "pending" && (
              <Button
                onClick={handleMarkAsPaid}
                variant="secondary"
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Marcar como Pagada
              </Button>
            )}
            
            <Link to={`/invoices/edit/${invoice.id}`}>
              <Button variant="outline" className="gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            
            {invoice.pdfUrl && (
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
              </a>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Eliminarás permanentemente la factura {invoice.invoiceNumber}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600 text-sm">Estado:</span>
                <div>{getStatusBadge(invoice.status)}</div>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600 text-sm">Nº Factura:</span>
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span className="text-gray-600 text-sm">Fecha Emisión:</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              
              {invoice.dueDate && (
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600 text-sm">Fecha Vencimiento:</span>
                  <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                </div>
              )}
              
              {invoice.status === "paid" && invoice.paymentDate && (
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600 text-sm">Fecha Pago:</span>
                  <span className="font-medium">{formatDate(invoice.paymentDate)}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 mt-2">
                <span className="text-gray-800 font-semibold">Total a Pagar:</span>
                <span className="text-blue-700 font-bold text-lg">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
