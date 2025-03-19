
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Calendar, Euro, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Invoice } from "@/types/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ClientInvoicesWidget() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Only fetch invoices for the current client
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('client_id', user.id)
          .order('issue_date', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error("Error fetching invoices:", error);
          return;
        }
        
        // Map database fields to client type fields
        const mappedInvoices: Invoice[] = data ? data.map(item => ({
          id: item.id,
          invoiceNumber: item.invoice_number,
          clientId: item.client_id,
          issueDate: item.issue_date,
          dueDate: item.due_date,
          packId: item.pack_id,
          proposalId: item.proposal_id,
          baseAmount: item.base_amount,
          taxRate: item.tax_rate,
          taxAmount: item.tax_amount,
          totalAmount: item.total_amount,
          status: item.status as "pending" | "paid" | "cancelled" | "draft",
          paymentDate: item.payment_date,
          notes: item.notes,
          pdfUrl: item.pdf_url,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) : [];
        
        setInvoices(mappedInvoices);
      } catch (error) {
        console.error("Exception fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pagada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-blue-500" />
          Mis Facturas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No hay facturas disponibles</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(invoice.issueDate), "d MMM yyyy", { locale: es })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(invoice.status)}
                  <Link to={`/invoices/${invoice.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only sm:inline-block">Ver</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Link to={`/clients/${user?.id}?tab=invoices`}>
                <Button variant="secondary">Ver todas las facturas</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
