
import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge, PriorityBadge } from "./TicketBadges";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

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
  const [clientName, setClientName] = useState<string>("");

  // Fetch client name if admin
  useEffect(() => {
    const fetchClientName = async () => {
      if (userRole === 'admin' && ticket.client_id) {
        const { data, error } = await supabase
          .from('clients')
          .select('name')
          .eq('id', ticket.client_id)
          .single();
        
        if (data && !error) {
          setClientName(data.name);
        } else {
          // Fallback to showing the client ID if we can't get the name
          setClientName(ticket.client_id.substring(0, 8) + '...');
        }
      }
    };

    fetchClientName();
  }, [ticket.client_id, userRole]);

  return (
    <TableRow 
      key={ticket.id}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => {
        // Handle viewing the ticket details (we'll implement this later)
        console.log("View ticket:", ticket.id);
      }}
    >
      {userRole === 'admin' && (
        <TableCell>{clientName}</TableCell>
      )}
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
      <TableCell>
        <Button size="sm" variant="ghost">
          <MessageSquare className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </TableCell>
    </TableRow>
  );
}
