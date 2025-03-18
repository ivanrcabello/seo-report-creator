
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, createTicket, replyToTicket, updateTicketStatus, getTicketMessages, getTicketById } from "@/services/ticketService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useTickets = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { userRole, user } = useAuth();

  console.log("[useTickets] Initialization with clientId:", clientId);
  console.log("[useTickets] User role:", userRole, "User:", user);

  // For admins without a specific clientId, fetch all tickets
  const shouldFetchAllTickets = userRole === 'admin' && !clientId;
  
  const { 
    data: tickets = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tickets', clientId, shouldFetchAllTickets],
    queryFn: () => {
      console.log("[useTickets] Fetching tickets with clientId:", clientId, "shouldFetchAllTickets:", shouldFetchAllTickets);
      console.log("[useTickets] Current user role:", userRole, "User:", user?.id);
      
      if (shouldFetchAllTickets) {
        // Admin fetching all tickets (no clientId filter)
        return getTickets();
      }
      
      // Either an admin looking at a specific client, or a client looking at their own tickets
      return getTickets(clientId);
    },
  });

  console.log("[useTickets] Tickets fetched:", tickets?.length || 0);
  if (error) {
    console.error("[useTickets] Error fetching tickets:", error);
  }

  const createTicketMutation = useMutation({
    mutationFn: ({ subject, message, priority }: { 
      subject: string;
      message: string;
      priority?: 'low' | 'medium' | 'high';
    }) => {
      console.log("[useTickets] Creating ticket with subject:", subject);
      console.log("[useTickets] User role:", userRole, "Client ID:", clientId, "User ID:", user?.id);
      
      if (!clientId && userRole === 'client' && user?.id) {
        // If no clientId provided but user is a client, use their ID
        return createTicket(user.id, subject, message, priority);
      } else if (!clientId && userRole === 'admin' && !user?.id) {
        throw new Error("No client ID specified for admin to create ticket");
      }
      
      return createTicket(clientId!, subject, message, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket creado correctamente");
      console.log("[useTickets] Ticket created successfully");
    },
    onError: (error) => {
      console.error("[useTickets] Error creating ticket:", error);
      toast.error("Error al crear el ticket");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }: {
      ticketId: string;
      status: 'open' | 'in_progress' | 'resolved';
    }) => updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Estado del ticket actualizado");
      console.log("[useTickets] Ticket status updated successfully");
    },
    onError: (error) => {
      console.error("[useTickets] Error updating ticket status:", error);
      toast.error("Error al actualizar el estado del ticket");
    }
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
    createTicket: createTicketMutation.mutate,
    updateTicketStatus: updateStatusMutation.mutate
  };
};

export const useTicket = (ticketId: string) => {
  const queryClient = useQueryClient();
  console.log("[useTicket] Initialization with ticketId:", ticketId);

  const { 
    data: ticket,
    isLoading: isTicketLoading,
    error: ticketError,
    refetch: refetchTicket
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => {
      console.log("[useTicket] Fetching ticket details for:", ticketId);
      return getTicketById(ticketId);
    },
    enabled: !!ticketId
  });

  if (ticketError) {
    console.error("[useTicket] Error fetching ticket:", ticketError);
  }
  
  if (ticket) {
    console.log("[useTicket] Ticket fetched:", ticket.id, ticket.subject);
  }

  const { 
    data: messages = [], 
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: () => {
      console.log("[useTicket] Fetching messages for ticket:", ticketId);
      return getTicketMessages(ticketId);
    },
    enabled: !!ticketId
  });

  if (messagesError) {
    console.error("[useTicket] Error fetching ticket messages:", messagesError);
  }
  
  console.log("[useTicket] Messages fetched:", messages?.length || 0);

  const replyMutation = useMutation({
    mutationFn: ({ senderId, message }: { senderId: string; message: string }) => {
      console.log("[useTicket] Replying to ticket:", ticketId, "from sender:", senderId);
      return replyToTicket(ticketId, senderId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Respuesta enviada correctamente");
      console.log("[useTicket] Reply sent successfully");
    },
    onError: (error) => {
      console.error("[useTicket] Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'open' | 'in_progress' | 'resolved') => {
      console.log("[useTicket] Updating ticket status:", ticketId, "to", status);
      return updateTicketStatus(ticketId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Estado del ticket actualizado");
      console.log("[useTicket] Status updated successfully");
    },
    onError: (error) => {
      console.error("[useTicket] Error updating ticket status:", error);
      toast.error("Error al actualizar el estado del ticket");
    }
  });

  return {
    ticket,
    messages,
    isLoading: isTicketLoading || isMessagesLoading,
    error: ticketError || messagesError,
    refetch: () => {
      console.log("[useTicket] Refetching ticket and messages");
      refetchTicket();
      refetchMessages();
    },
    reply: replyMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isReplying: replyMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending
  };
};
