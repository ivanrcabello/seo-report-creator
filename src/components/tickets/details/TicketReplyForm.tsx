
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface TicketReplyFormProps {
  ticketStatus: string;
  newReplyMessage: string;
  setNewReplyMessage: (message: string) => void;
  onSendReply: () => void;
  isReplying: boolean;
}

export function TicketReplyForm({
  ticketStatus,
  newReplyMessage,
  setNewReplyMessage,
  onSendReply,
  isReplying
}: TicketReplyFormProps) {
  if (ticketStatus === 'resolved') {
    return null;
  }

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={newReplyMessage}
        onChange={(e) => setNewReplyMessage(e.target.value)}
        placeholder="Escribe tu respuesta aquí..."
        className="flex-1"
        rows={3}
      />
      <Button 
        size="icon" 
        onClick={onSendReply}
        disabled={isReplying || !newReplyMessage.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
