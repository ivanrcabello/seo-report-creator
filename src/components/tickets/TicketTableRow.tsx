
import { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "./TicketBadges";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TicketTableRowProps {
  ticket: {
    id: string;
    subject: string;
    status: string;
    priority: string;
    client_id: string;
    created_at: string;
  };
}

export function TicketTableRow({ ticket }: TicketTableRowProps) {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [clientName, setClientName] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("[TicketTableRow] Rendered for ticket:", ticket.id);
  }, [ticket.id]);

  const handleViewTicket = () => {
    console.log("[TicketTableRow] Navigating to ticket details:", ticket.id);
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium max-w-[250px] truncate" title={ticket.subject}>
        {ticket.subject}
      </TableCell>
      <TableCell>
        <StatusBadge status={ticket.status} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={ticket.priority} />
      </TableCell>
      {userRole === 'admin' && (
        <TableCell className="text-sm text-gray-500">
          {clientName || "Cliente ID: " + ticket.client_id.substring(0, 8) + "..."}
        </TableCell>
      )}
      <TableCell className="text-sm text-gray-500">
        {new Date(ticket.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={handleViewTicket}>
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </TableCell>
    </TableRow>
  );
}
