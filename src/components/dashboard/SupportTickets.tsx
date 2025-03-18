
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { TicketCard } from "../tickets/TicketCard";
import { TicketListItem } from "../tickets/TicketListItem";
import { NewTicketDialogContent } from "../tickets/NewTicketDialogContent";
import { TicketDetailsContent } from "../tickets/TicketDetailsContent";
import { useSupportTickets } from "@/hooks/useSupportTickets";

export function SupportTickets() {
  const { user } = useAuth();
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showTicketDetailsDialog, setShowTicketDetailsDialog] = useState(false);
  const [newReplyMessage, setNewReplyMessage] = useState("");
  
  const {
    tickets,
    isLoading,
    isSubmitting,
    selectedTicket,
    setSelectedTicket,
    ticketMessages,
    isReplying,
    fetchTickets,
    fetchTicketMessages,
    createTicket,
    replyToTicket
  } = useSupportTickets(user?.id);

  const handleCreateTicket = async (subject: string, message: string, priority: string) => {
    const result = await createTicket(subject, message, priority);
    if (result) {
      setShowNewTicketDialog(false);
    }
  };

  const handleReplyToTicket = async () => {
    if (!selectedTicket) return;
    
    const success = await replyToTicket(selectedTicket.id, newReplyMessage);
    if (success) {
      setNewReplyMessage("");
    }
  };

  const openTicketDetails = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      fetchTicketMessages(ticket.id);
      setShowTicketDetailsDialog(true);
    }
  };

  return (
    <>
      <TicketCard
        title="Tickets de soporte"
        description="Gestiona tus consultas y solicitudes de soporte"
        isLoading={isLoading}
        onRefresh={fetchTickets}
        onNewTicket={() => setShowNewTicketDialog(true)}
      >
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No tienes tickets de soporte</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => setShowNewTicketDialog(true)}
            >
              Crear tu primer ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                id={ticket.id}
                subject={ticket.subject}
                message={ticket.message}
                status={ticket.status}
                priority={ticket.priority}
                created_at={ticket.created_at}
                onClick={openTicketDetails}
              />
            ))}
          </div>
        )}
      </TicketCard>

      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <NewTicketDialogContent
          onCancel={() => setShowNewTicketDialog(false)}
          onSubmit={handleCreateTicket}
          isSubmitting={isSubmitting}
        />
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        <TicketDetailsContent
          ticket={selectedTicket}
          messages={ticketMessages}
          userId={user?.id}
          newReplyMessage={newReplyMessage}
          setNewReplyMessage={setNewReplyMessage}
          isReplying={isReplying}
          onSendReply={handleReplyToTicket}
        />
      </Dialog>
    </>
  );
}
