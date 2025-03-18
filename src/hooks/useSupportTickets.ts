
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export const useSupportTickets = (userId?: string) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId]);

  const fetchTickets = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Map the data to ensure status is of the correct type
      const typedTickets: SupportTicket[] = (data || []).map(ticket => ({
        ...ticket,
        status: (ticket.status as 'open' | 'in_progress' | 'resolved') || 'open',
        priority: (ticket.priority as 'low' | 'medium' | 'high') || 'medium'
      }));
      
      setTickets(typedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Error al cargar los tickets de soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTicketMessages(data || []);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      toast.error("Error al cargar los mensajes del ticket");
    }
  };

  const createTicket = async (subject: string, message: string, priority: string) => {
    if (!userId) return;

    if (!subject.trim()) {
      toast.error("Por favor, introduce un asunto para el ticket");
      return;
    }

    if (!message.trim()) {
      toast.error("Por favor, introduce un mensaje para el ticket");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            client_id: userId,
            subject,
            message,
            priority
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Ticket creado correctamente");
      
      // Refresh tickets list
      fetchTickets();
      return data;
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error al crear el ticket");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const replyToTicket = async (ticketId: string, message: string) => {
    if (!userId || !message.trim()) return;

    try {
      setIsReplying(true);
      
      const { error } = await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: ticketId,
            sender_id: userId,
            message
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast.success("Respuesta enviada correctamente");
      
      // Refresh messages
      fetchTicketMessages(ticketId);
      return true;
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
      return false;
    } finally {
      setIsReplying(false);
    }
  };

  return {
    tickets,
    isLoading,
    isSubmitting,
    selectedTicket,
    setSelectedTicket,
    ticketMessages,
    isReplying,
    fetchTickets,
    fetchTicketMessages,
    createTicket,
    replyToTicket
  };
};
