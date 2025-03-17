
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Check, 
  Download,
  Printer,
  Mail
} from "lucide-react";
import { Invoice } from "@/types/invoice";
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

interface InvoiceDetailHeaderProps {
  invoice: Invoice;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => Promise<void>;
  statusBadge: React.ReactNode;
  onGoBack: () => void;
}

export const InvoiceDetailHeader = ({ 
  invoice, 
  onDelete, 
  onMarkAsPaid,
  onDownloadPdf,
  onSendEmail,
  statusBadge,
  onGoBack
}: InvoiceDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGoBack}
          className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-white" />
          Factura {invoice.invoiceNumber}
        </h1>
        {statusBadge}
      </div>
      
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <Button
          onClick={onDownloadPdf}
          variant="outline"
          className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
        >
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
        
        <Button
          onClick={onSendEmail}
          variant="outline"
          className="gap-1 bg-white text-seo-blue hover:bg-gray-100"
        >
          <Mail className="h-4 w-4" />
          Enviar por Email
        </Button>
        
        {invoice.status === "pending" && (
          <Button
            onClick={onMarkAsPaid}
            variant="secondary"
            className="gap-1 bg-white text-seo-purple font-medium hover:bg-gray-100"
          >
            <Check className="h-4 w-4" />
            Marcar como Pagada
          </Button>
        )}
        
        <Link to={`/invoices/edit/${invoice.id}`}>
          <Button variant="outline" className="gap-1 bg-white text-seo-blue hover:bg-gray-100">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700">
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
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
