
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Check, 
  Download
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
  statusBadge: React.ReactNode;
  onGoBack: () => void;
}

export const InvoiceDetailHeader = ({ 
  invoice, 
  onDelete, 
  onMarkAsPaid, 
  statusBadge,
  onGoBack
}: InvoiceDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGoBack}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-blue-600" />
          Factura {invoice.invoiceNumber}
        </h1>
        {statusBadge}
      </div>
      
      <div className="flex items-center space-x-2">
        {invoice.status === "pending" && (
          <Button
            onClick={onMarkAsPaid}
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
