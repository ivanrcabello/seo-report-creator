
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Ticket, Filter, ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { TicketsList } from "@/components/tickets/TicketsList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TicketsTabProps {
  clientId?: string;
}

export function TicketsTab({ clientId }: TicketsTabProps) {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<string>("created_at");

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching tickets...");
      
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          clients(name)
        `);
      
      // If clientId is provided, filter by that specific client
      if (clientId) {
        console.log("Filtering tickets by clientId:", clientId);
        query = query.eq('client_id', clientId);
      }
      // Otherwise, if not admin, only fetch tickets for the current user
      else if (!isAdmin && user?.id) {
        query = query.eq('client_id', user.id);
      }
      
      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === "asc" });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error("Error fetching tickets:", fetchError);
        setError("Error al cargar los tickets");
        return;
      }
      
      console.log(`Fetched ${data?.length || 0} tickets`);
      setTickets(data || []);
    } catch (err) {
      console.error("Exception fetching tickets:", err);
      setError("Error inesperado al cargar los tickets");
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, sortField, sortOrder, clientId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = useCallback(() => {
    const path = clientId ? `/tickets/new?clientId=${clientId}` : "/tickets/new";
    navigate(path);
  }, [navigate, clientId]);

  const handleToggleSort = useCallback(() => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  }, []);

  const handleChangeSortField = useCallback((field: string) => {
    setSortField(field);
  }, []);

  // Map tickets to the format expected by TicketsList
  const mappedTickets = tickets.map(ticket => ({
    id: ticket.id,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    client_id: ticket.client_id,
    client_name: ticket.clients?.name || "Cliente desconocido",
    created_at: ticket.created_at
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Ticket className="h-5 w-5 text-blue-600" />
          Tickets de Soporte
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1" 
              onClick={handleToggleSort}
            >
              {sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {sortField === "created_at" ? "Fecha" : 
                sortField === "priority" ? "Prioridad" : 
                sortField === "status" ? "Estado" : "Ordenar"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleChangeSortField("created_at")}
            >
              Fecha
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleChangeSortField("priority")}
            >
              Prioridad
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleChangeSortField("status")}
            >
              Estado
            </Button>
          </div>
          <Button onClick={handleCreateTicket} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Nuevo Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="py-8 text-center">
            <p className="text-red-500 mb-3">{error}</p>
            <Button variant="outline" onClick={fetchTickets}>
              Reintentar
            </Button>
          </div>
        ) : (
          <TicketsList tickets={mappedTickets} />
        )}
      </CardContent>
    </Card>
  );
}

export default TicketsTab;
