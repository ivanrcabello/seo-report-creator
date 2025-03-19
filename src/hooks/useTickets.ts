import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, createTicket, replyToTicket, updateTicketStatus, getTicketMessages, getTicketById } from "@/services/ticketService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

export const useTickets = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { userRole, user } = useAuth();

  const shouldFetchAllTickets = userRole === 'admin' && !clientId;
  
  const { 
    data: tickets = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tickets', clientId, shouldFetchAllTickets],
    queryFn: () => {
      console.log("Fetching tickets with clientId:", clientId, "shouldFetchAllTickets:", shouldFetchAllTickets);
      console.log("Current user role:", userRole, "User:", user?.id);
      
      if (shouldFetchAllTickets) {
        return getTickets();
      }
      
      return getTickets(clientId);
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: ({ subject, message, priority }: { 
      subject: string;
      message: string;
      priority?: 'low' | 'medium' | 'high';
    }) => {
      console.log("Creating ticket with subject:", subject);
      console.log("User role:", userRole, "Client ID:", clientId, "User ID:", user?.id);
      
      if (!clientId && userRole === 'client' && user?.id) {
        return createTicket(user.id, subject, message, priority);
      } else if (!clientId && userRole === 'admin' && !user?.id) {
        throw new Error("No client ID specified for admin to create ticket");
      }
      
      return createTicket(clientId!, subject, message, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Ticket creado correctamente");
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
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
    },
    onError: (error) => {
      console.error("Error updating ticket status:", error);
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

  const { 
    data: ticket,
    isLoading: isTicketLoading,
    error: ticketError,
    refetch: refetchTicket
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId
  });

  const { 
    data: messages = [], 
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId
  });

  const replyMutation = useMutation({
    mutationFn: ({ senderId, message }: { senderId: string; message: string }) => 
      replyToTicket(ticketId, senderId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Respuesta enviada correctamente");
    },
    onError: (error) => {
      console.error("Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'open' | 'in_progress' | 'resolved') => 
      updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success("Estado del ticket actualizado");
    },
    onError: (error) => {
      console.error("Error updating ticket status:", error);
      toast.error("Error al actualizar el estado del ticket");
    }
  });

  return {
    ticket,
    messages,
    isLoading: isTicketLoading || isMessagesLoading,
    error: ticketError || messagesError,
    refetch: () => {
      refetchTicket();
      refetchMessages();
    },
    reply: replyMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isReplying: replyMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending
  };
};
