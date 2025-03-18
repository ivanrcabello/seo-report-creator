
import { supabase } from "@/integrations/supabase/client";

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  client_id: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export const getTickets = async (clientId?: string) => {
  try {
    let query = supabase.from('support_tickets').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Ticket[];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getTicketMessages = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as TicketMessage[];
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    throw error;
  }
};

export const createTicket = async (
  clientId: string,
  subject: string,
  message: string,
  priority: Ticket['priority'] = 'medium'
) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          client_id: clientId,
          subject,
          message,
          priority,
          status: 'open'
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as Ticket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const replyToTicket = async (ticketId: string, senderId: string, message: string) => {
  try {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert([
        {
          ticket_id: ticketId,
          sender_id: senderId,
          message
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as TicketMessage;
  } catch (error) {
    console.error("Error replying to ticket:", error);
    throw error;
  }
};

export const updateTicketStatus = async (
  ticketId: string, 
  status: Ticket['status']
) => {
  try {
    const updates: Partial<Ticket> = {
      status,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Ticket;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};
