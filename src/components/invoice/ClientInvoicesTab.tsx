import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Invoice } from "@/types/client";
import { ClientInvoices } from "@/components/ClientInvoices";
import { getClientInvoices } from "@/services/invoiceService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ClientInvoicesTabProps {
  clientId: string;
  clientName?: string;
}

export const ClientInvoicesTab = React.memo(({ clientId, clientName }: ClientInvoicesTabProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const fetchInvoices = useCallback(async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching invoices for client:", clientId);
      
      // SECURITY FIX: Only fetch invoices that belong to the current user unless admin
      // Admin can see specific client invoices, but regular user can only see their own
      if (!isAdmin && user?.id !== clientId) {
        console.log("Security check: Non-admin trying to access another user's invoices");
        setInvoices([]);
        toast.error("No tienes permiso para ver estas facturas");
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
  }, [clientId, isAdmin, user]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleAddInvoice = useCallback(() => {
    navigate(`/invoices/new?clientId=${clientId}`);
  }, [navigate, clientId]);

  // Custom back navigation for client view
  const handleViewAllInvoices = useCallback(() => {
    // SECURITY FIX: Always navigate to the correct user's invoices
    if (!isAdmin && user?.id) {
      // If client, navigate to their dashboard with invoices tab selected
      navigate(`/clients/${user.id}?tab=invoices`);
    } else {
      // If admin, use the standard path
      navigate(`/clients/${clientId}?tab=invoices`);
    }
  }, [isAdmin, user, navigate, clientId]);

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
      onAddInvoice={isAdmin ? handleAddInvoice : undefined}
      onViewAll={handleViewAllInvoices}
    />
  );
});

// Add display name for debugging purposes
ClientInvoicesTab.displayName = 'ClientInvoicesTab';
