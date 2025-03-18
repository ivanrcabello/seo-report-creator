
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, createTicket, replyToTicket, updateTicketStatus, getTicketMessages } from "@/services/ticketService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
      if (!clientId && userRole === 'client' && user?.id) {
        // If no clientId provided but user is a client, use their ID
        return createTicket(user.id, subject, message, priority);
      } else if (!clientId && !user?.id) {
        throw new Error("Client ID is required");
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

export const useTicketMessages = (ticketId: string) => {
  const queryClient = useQueryClient();

  const { 
    data: messages = [], 
    isLoading,
    error 
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
      toast.success("Respuesta enviada correctamente");
    },
    onError: (error) => {
      console.error("Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
    }
  });

  return {
    messages,
    isLoading,
    error,
    reply: replyMutation.mutate
  };
};
