
import { Table, TableBody } from "@/components/ui/table";
import { TicketTableHeader } from "./TicketTableHeader";
import { TicketTableRow } from "./TicketTableRow";

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
  return (
    <Table>
      <TicketTableHeader />
      <TableBody>
        {tickets.map((ticket) => (
          <TicketTableRow key={ticket.id} ticket={ticket} />
        ))}
      </TableBody>
    </Table>
  );
}
