
import { TableRow, TableCell } from "@/components/ui/table";
import { StatusBadge, PriorityBadge } from "./TicketBadges";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch client name if admin
  useEffect(() => {
    const fetchClientName = async () => {
      if (userRole === 'admin' && ticket.client_id) {
        setIsLoading(true);
        try {
          // First check in clients table
          let { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('name')
            .eq('id', ticket.client_id)
            .maybeSingle();
          
          if (clientData && !clientError) {
            setClientName(clientData.name);
          } else {
            // Fallback to profiles table if not found in clients
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', ticket.client_id)
              .single();
            
            if (profileData && !profileError) {
              setClientName(profileData.name || profileData.email);
            } else {
              // If all else fails, just show the ID
              setClientName(ticket.client_id.substring(0, 8) + '...');
            }
          }
        } catch (error) {
          console.error("Error fetching client name:", error);
          setClientName(ticket.client_id.substring(0, 8) + '...');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientName();
  }, [ticket.client_id, userRole]);

  const handleViewTicket = () => {
    console.log("View ticket:", ticket.id);
    // Here we would implement viewing the ticket details
  };

  return (
    <TableRow 
      key={ticket.id}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleViewTicket}
    >
      {userRole === 'admin' && (
        <TableCell>
          {isLoading ? (
            <span className="text-gray-400">Cargando...</span>
          ) : (
            clientName
          )}
        </TableCell>
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
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={(e) => {
            e.stopPropagation();
            handleViewTicket();
          }}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
