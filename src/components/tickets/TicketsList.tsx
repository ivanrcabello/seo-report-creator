
import { Table, TableBody } from "@/components/ui/table";
import { TicketTableHeader } from "./TicketTableHeader";
import { TicketTableRow } from "./TicketTableRow";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

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
  
  // Log the tickets to debug
  useEffect(() => {
    console.log("Tickets in TicketsList:", tickets);
  }, [tickets]);
  
  return (
    <div className="overflow-auto">
      <Table>
        <TicketTableHeader />
        <TableBody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={userRole === 'admin' ? 6 : 5} className="py-6 text-center text-gray-500">
                No hay tickets disponibles
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <TicketTableRow key={ticket.id} ticket={ticket} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
