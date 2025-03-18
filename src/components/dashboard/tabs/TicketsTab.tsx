
import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NewTicketDialog } from "@/components/tickets/NewTicketDialog";
import { TicketsList } from "@/components/tickets/TicketsList";

interface TicketsTabProps {
  clientId?: string;
}

export function TicketsTab({ clientId }: TicketsTabProps) {
  const { userRole } = useAuth();
  const { tickets, isLoading, error, createTicket } = useTickets(clientId);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTicket = async ({ subject, message, priority }: { 
    subject: string; 
    message: string; 
    priority: string;
  }) => {
    try {
      setIsSubmitting(true);
      await createTicket({
        subject,
        message,
        priority: priority as 'low' | 'medium' | 'high'
      });
      setShowNewTicketDialog(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
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

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar los tickets
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Tickets de soporte</h2>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' ? 'Gestiona los tickets de soporte' : 'Gestiona tus tickets de soporte'}
          </p>
        </div>
        <Button onClick={() => setShowNewTicketDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      <TicketsList tickets={tickets} />

      <NewTicketDialog
        open={showNewTicketDialog}
        onOpenChange={setShowNewTicketDialog}
        onSubmit={handleCreateTicket}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
