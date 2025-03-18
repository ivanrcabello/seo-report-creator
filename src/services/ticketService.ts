
import { supabase } from "@/integrations/supabase/client";
import logger from "@/services/advancedLogService";

// Logger específico para el servicio de tickets
const ticketLogger = logger.getLogger('ticketService');

// Definición de tipos
export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  client_id: string;
  resolved_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

// Obtener tickets (para admin: todos, para cliente: solo los suyos)
export const getTickets = async (clientId?: string): Promise<Ticket[]> => {
  ticketLogger.info("getTickets called with clientId:", clientId);
  
  try {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Si se proporciona un ID de cliente, filtrar por ese cliente
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      ticketLogger.error("Error fetching tickets:", error);
      throw error;
    }
    
    ticketLogger.info("Tickets fetched:", data?.length || 0);
    return data as Ticket[];
  } catch (error) {
    ticketLogger.error("Exception in getTickets:", error);
    throw error;
  }
};

// Obtener un ticket específico por ID
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  ticketLogger.info("getTicketById called for ticket:", ticketId);
  
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (error) {
      ticketLogger.error("Error fetching ticket:", error);
      throw error;
    }
    
    ticketLogger.info("Ticket fetched successfully");
    return data as Ticket;
  } catch (error) {
    ticketLogger.error("Exception in getTicketById:", error);
    throw error;
  }
};

// Obtener mensajes de un ticket
export const getTicketMessages = async (ticketId: string): Promise<TicketMessage[]> => {
  ticketLogger.info("getTicketMessages called for ticket:", ticketId);
  
  try {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (error) {
      ticketLogger.error("Error fetching ticket messages:", error);
      throw error;
    }
    
    ticketLogger.info("Ticket messages fetched:", data?.length || 0);
    return data as TicketMessage[];
  } catch (error) {
    ticketLogger.error("Exception in getTicketMessages:", error);
    throw error;
  }
};

// Crear un nuevo ticket
export const createTicket = async (
  clientId: string, 
  subject: string, 
  message: string, 
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<Ticket> => {
  ticketLogger.info("createTicket called for client:", clientId);
  
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
    
    if (error) {
      ticketLogger.error("Error creating ticket:", error);
      throw error;
    }
    
    ticketLogger.info("Ticket created successfully:", data.id);
    return data as Ticket;
  } catch (error) {
    ticketLogger.error("Exception in createTicket:", error);
    throw error;
  }
};

// Responder a un ticket
export const replyToTicket = async (
  ticketId: string, 
  senderId: string, 
  message: string
): Promise<TicketMessage> => {
  ticketLogger.info("replyToTicket called for ticket:", ticketId);
  
  try {
    // Insertar el mensaje
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
    
    if (error) {
      ticketLogger.error("Error replying to ticket:", error);
      throw error;
    }
    
    // Actualizar la fecha de actualización del ticket
    await supabase
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    
    ticketLogger.info("Reply sent successfully");
    return data as TicketMessage;
  } catch (error) {
    ticketLogger.error("Exception in replyToTicket:", error);
    throw error;
  }
};

// Actualizar el estado de un ticket
export const updateTicketStatus = async (
  ticketId: string, 
  status: 'open' | 'in_progress' | 'resolved'
): Promise<Ticket> => {
  ticketLogger.info("updateTicketStatus called for ticket:", ticketId, "new status:", status);
  
  try {
    const updates: any = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    // Si se marca como resuelto, establecer la fecha de resolución
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString();
    } else {
      // Si se reabre, eliminar la fecha de resolución
      updates.resolved_at = null;
    }
    
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) {
      ticketLogger.error("Error updating ticket status:", error);
      throw error;
    }
    
    ticketLogger.info("Ticket status updated successfully");
    return data as Ticket;
  } catch (error) {
    ticketLogger.error("Exception in updateTicketStatus:", error);
    throw error;
  }
};
