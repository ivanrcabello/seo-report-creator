
import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge, PriorityBadge } from "./TicketBadges";
import { useAuth } from "@/contexts/AuthContext";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  client_id: string;
  created_at: string;
}

interface TicketTableRowProps {
  ticket: Ticket;
}

export function TicketTableRow({ ticket }: TicketTableRowProps) {
  const { userRole } = useAuth();

  return (
    <TableRow key={ticket.id}>
      {userRole === 'admin' && <TableCell>{ticket.client_id}</TableCell>}
      <TableCell>{ticket.subject}</TableCell>
      <TableCell><StatusBadge status={ticket.status} /></TableCell>
      <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
      <TableCell>
        {new Date(ticket.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </TableCell>
    </TableRow>
  );
}
