
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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

interface TicketsListProps {
  tickets: Ticket[];
}

export function TicketsList({ tickets }: TicketsListProps) {
  const { userRole } = useAuth();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {userRole === 'admin' && <TableHead>Cliente</TableHead>}
          <TableHead>Asunto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Prioridad</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
