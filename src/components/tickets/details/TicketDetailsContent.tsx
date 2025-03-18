
import { DialogContent } from "@/components/ui/dialog";
import { TicketHeader } from "./TicketHeader";
import { TicketOriginalMessage } from "./TicketOriginalMessage";
import { TicketMessageThread } from "./TicketMessageThread";
import { TicketReplyForm } from "./TicketReplyForm";

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface TicketDetailsContentProps {
  ticket: {
    id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    created_at: string;
  } | null;
  messages: TicketMessage[];
  userId?: string;
  newReplyMessage: string;
  setNewReplyMessage: (message: string) => void;
  isReplying: boolean;
  onSendReply: () => void;
}

export function TicketDetailsContent({
  ticket,
  messages,
  userId,
  newReplyMessage,
  setNewReplyMessage,
  isReplying,
  onSendReply
}: TicketDetailsContentProps) {
  if (!ticket) return null;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
      <TicketHeader ticket={ticket} />
      
      <div className="py-4">
        {/* Original message */}
        <TicketOriginalMessage message={ticket.message} />

        {/* Message thread */}
        <TicketMessageThread messages={messages} userId={userId} />

        {/* Reply input */}
        {ticket.status !== 'resolved' && (
          <TicketReplyForm
            ticketStatus={ticket.status}
            newReplyMessage={newReplyMessage}
            setNewReplyMessage={setNewReplyMessage}
            onSendReply={onSendReply}
            isReplying={isReplying}
          />
        )}
      </div>
    </DialogContent>
  );
}
