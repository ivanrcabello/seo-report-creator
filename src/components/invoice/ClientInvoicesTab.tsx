
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { ClientInvoices } from "@/components/ClientInvoices";
import { getClientInvoices } from "@/services/invoiceService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ClientInvoicesTabProps {
  clientId: string;
  clientName?: string;
}

export const ClientInvoicesTab = ({ clientId, clientName }: ClientInvoicesTabProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientId) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching invoices for client:", clientId);
        const data = await getClientInvoices(clientId);
        console.log("Invoices data:", data);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Error al cargar las facturas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [clientId]);

  const handleAddInvoice = () => {
    navigate(`/invoices/new?clientId=${clientId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
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
