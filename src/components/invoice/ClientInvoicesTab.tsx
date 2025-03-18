
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { ClientInvoices } from "@/components/ClientInvoices";
import { getClientInvoices } from "@/services/invoice/invoiceCrud";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

interface ClientInvoicesTabProps {
  clientId: string;
  clientName?: string;
}

export const ClientInvoicesTab = ({ clientId, clientName }: ClientInvoicesTabProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientId) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching invoices for client:", clientId);
        
        // SECURITY CHECK: Only fetch invoices that belong to the current user unless admin
        // Admin can see specific client invoices, but regular user can only see their own
        if (!isAdmin && user?.id !== clientId) {
          console.error("Security check: Non-admin trying to access another user's invoices");
          setInvoices([]);
          toast.error("No tienes permiso para ver estas facturas");
          navigate("/dashboard");
          return;
        }
        
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
  }, [clientId, isAdmin, user, navigate]);

  const handleAddInvoice = () => {
    // ONLY admins can create new invoices
    if (!isAdmin) {
      toast.error("No tienes permiso para crear facturas");
      return;
    }
    navigate(`/invoices/new?clientId=${clientId}`);
  };

  // Only show add invoice button for admins
  const onAddInvoice = isAdmin ? handleAddInvoice : undefined;

  // Custom back navigation for client view
  const handleViewAllInvoices = () => {
    // SECURITY FIX: Always navigate to the correct user's invoices
    if (!isAdmin && user?.id) {
      // If client, navigate to their dashboard with invoices tab selected
      navigate(`/dashboard?tab=invoices`);
    } else {
      // If admin, navigate to client detail
      navigate(`/clients/${clientId}?tab=invoices`);
    }
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
      onAddInvoice={onAddInvoice}
      onViewAll={handleViewAllInvoices}
    />
  );
};
