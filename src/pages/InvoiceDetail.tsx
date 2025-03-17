import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { getInvoice, markInvoiceAsPaid, deleteInvoice } from "@/services/invoiceService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvoiceDetailsCard } from "@/components/invoice/InvoiceDetailsCard";
import { InvoiceDetailHeader } from "@/components/invoice/InvoiceDetailHeader";
import { PaymentInfoCard } from "@/components/invoice/PaymentInfoCard";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileSpreadsheet, Loader2, Trash2 } from "lucide-react";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getInvoice(id)
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleMarkAsPaid = async () => {
    if (!id) return;

    setMarkingAsPaid(true);

    try {
      const success = await markInvoiceAsPaid(id);

      if (success) {
        toast.success("Factura marcada como pagada correctamente");
        setMarkingAsPaid(false);
      } else {
        throw new Error("Error al marcar la factura como pagada");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("No se pudo marcar la factura como pagada");
      setMarkingAsPaid(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteInvoice(id);
      
      if (success) {
        toast.success("Factura eliminada correctamente");
        navigate("/invoices");
      } else {
        throw new Error("Error al eliminar la factura");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("No se pudo eliminar la factura");
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <InvoiceDetailHeader 
        invoice={invoice} 
        onMarkAsPaid={handleMarkAsPaid} 
        isMarkingAsPaid={markingAsPaid}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <InvoiceDetailsCard invoice={invoice} />
        </div>
        <div>
          <PaymentInfoCard invoice={invoice} />
          
          <Card className="p-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Acciones adicionales</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Eliminar Factura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La factura será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteInvoice}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </div>
    </div>
  );
}
