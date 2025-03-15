
import { useState, useEffect } from "react";
import { Invoice } from "@/types/invoice";
import { getClientInvoices } from "@/services/invoiceService";
import { ClientInvoices } from "@/components/ClientInvoices";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ClientInvoicesTabProps {
  clientId: string;
  clientName: string;
}

export const ClientInvoicesTab = ({ clientId, clientName }: ClientInvoicesTabProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        const invoicesData = await getClientInvoices(clientId);
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error loading client invoices:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las facturas del cliente",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [clientId, toast]);

  const handleAddInvoice = () => {
    navigate(`/invoices/new?clientId=${clientId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          <span className="text-lg">Cargando facturas...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <ClientInvoices
      invoices={invoices}
      clientName={clientName}
      clientId={clientId}
      onAddInvoice={handleAddInvoice}
    />
  );
};
