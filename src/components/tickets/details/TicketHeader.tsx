
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";

interface TicketHeaderProps {
  ticket: {
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  } | null;
}

export function TicketHeader({ ticket }: TicketHeaderProps) {
  if (!ticket) return null;
  
  return (
    <DialogHeader>
      <DialogTitle>{ticket.subject}</DialogTitle>
      <DialogDescription className="flex items-center gap-2">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
        <span className="text-xs ml-auto">
          {new Date(ticket.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </DialogDescription>
    </DialogHeader>
  );
}
