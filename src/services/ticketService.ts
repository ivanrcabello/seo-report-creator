
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
  sender_name?: string; // Optional field for UI display
  sender_role?: string; // Optional field for UI display
}

export const getTickets = async (clientId?: string) => {
  try {
    console.log("getTickets called with clientId:", clientId);
    let query = supabase.from('support_tickets').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error in getTickets:", error);
      throw error;
    }
    
    console.log("Tickets fetched:", data?.length || 0, data);
    return data as Ticket[];
  } catch (error) {
    console.error("Exception in getTickets:", error);
    throw error;
  }
};

export const getTicketById = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
    
    return data as Ticket;
  } catch (error) {
    console.error("Error in getTicketById:", error);
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
    
    if (error) {
      console.error("Error fetching ticket messages:", error);
      throw error;
    }
    
    // Add sender information to messages
    const messagesWithSenderInfo = await Promise.all(
      (data || []).map(async (message) => {
        try {
          // Check if sender is a client or admin
          const { data: senderData } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('id', message.sender_id)
            .single();
            
          return {
            ...message,
            sender_name: senderData?.name || 'Unknown',
            sender_role: senderData?.role || 'unknown'
          };
        } catch (error) {
          console.error("Error fetching sender info:", error);
          return {
            ...message,
            sender_name: 'Unknown',
            sender_role: 'unknown'
          };
        }
      })
    );
    
    console.log("Messages with sender info:", messagesWithSenderInfo);
    return messagesWithSenderInfo as TicketMessage[];
  } catch (error) {
    console.error("Error in getTicketMessages:", error);
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
    console.log("Creating ticket for client:", clientId, "with subject:", subject);
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
      .select();
    
    if (error) {
      console.error("Error in createTicket:", error);
      throw error;
    }
    
    console.log("Ticket created:", data);
    
    // Also create the first message in the ticket_messages table
    if (data && data.length > 0) {
      const ticketId = data[0].id;
      await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: ticketId,
            sender_id: clientId,
            message
          }
        ]);
    }
    
    return data[0] as Ticket;
  } catch (error) {
    console.error("Exception in createTicket:", error);
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
      .select();
    
    if (error) {
      console.error("Error replying to ticket:", error);
      throw error;
    }
    
    // Also update the ticket's updated_at timestamp
    await supabase
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
      
    return data[0] as TicketMessage;
  } catch (error) {
    console.error("Error in replyToTicket:", error);
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
      .select();
    
    if (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
    
    return data[0] as Ticket;
  } catch (error) {
    console.error("Error in updateTicketStatus:", error);
    throw error;
  }
};
