
import { useTickets } from "@/hooks/useTickets";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NewTicketDialog } from "@/components/tickets/NewTicketDialog";
import { TicketsList } from "@/components/tickets/TicketsList";
import { useTicketDialog } from "@/hooks/useTicketDialog";
import { useState, useEffect } from "react";

interface TicketsTabProps {
  clientId?: string;
}

export function TicketsTab({ clientId }: TicketsTabProps) {
  const { userRole, user } = useAuth();
  const { tickets, isLoading, error, createTicket, refetch } = useTickets(clientId);

  // Debug logs
  useEffect(() => {
    console.log("TicketsTab rendered with clientId:", clientId);
    console.log("Current user role:", userRole);
    console.log("Current user:", user);
    console.log("Tickets loaded:", tickets);
  }, [clientId, userRole, user, tickets]);
  
  // Refetch tickets on mount
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const { 
    showDialog, 
    isSubmitting, 
    openDialog, 
    closeDialog, 
    handleCreateTicket 
  } = useTicketDialog({
    onCreateTicket: async ({ subject, message, priority }) => {
      if (!clientId && userRole !== 'admin' && userRole !== 'client') {
        console.error("No client ID available for ticket creation");
        return;
      }

      // Use the clientId prop or the user's ID if they're a client
      const effectiveClientId = clientId || (userRole === 'client' ? user?.id : undefined);
      
      if (!effectiveClientId) {
        console.error("No effective client ID for ticket creation");
        return;
      }
      
      await createTicket({
        subject,
        message,
        priority: priority as 'low' | 'medium' | 'high'
      });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar los tickets: {(error as Error).message || 'Error desconocido'}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Tickets de soporte</h2>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' 
              ? 'Gestiona los tickets de soporte de todos los clientes' 
              : 'Gestiona tus tickets de soporte'}
          </p>
        </div>
        <Button onClick={openDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      <TicketsList tickets={tickets} />

      <NewTicketDialog
        open={showDialog}
        onOpenChange={closeDialog}
        onSubmit={handleCreateTicket}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
