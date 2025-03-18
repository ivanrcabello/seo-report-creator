
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTicket } from "@/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { TicketHeader } from "./TicketHeader";
import { TicketMessageThread } from "./TicketMessageThread";
import { TicketReplyForm } from "./TicketReplyForm";
import { TicketLoadingState } from "./TicketLoadingState";
import { TicketErrorState } from "./TicketErrorState";

export function TicketDetailView() {
  console.log("[TicketDetailView] Component rendered");
  const { ticketId } = useParams<{ ticketId: string }>();
  console.log("[TicketDetailView] Ticket ID from params:", ticketId);
  
  const { user } = useAuth();
  console.log("[TicketDetailView] Current user:", user?.id, user?.role);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    ticket,
    messages,
    isLoading,
    error,
    reply,
    updateStatus,
    isReplying,
    isUpdatingStatus,
    refetch
  } = useTicket(ticketId || "");

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Refetch data every 30 seconds to check for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSendMessage = async () => {
    if (!user?.id || !newMessage.trim()) return;
    
    console.log("[TicketDetailView] Sending message from user:", user.id);
    try {
      await reply({
        senderId: user.id,
        message: newMessage.trim()
      });
      setNewMessage("");
    } catch (error) {
      console.error("[TicketDetailView] Error sending message:", error);
    }
  };

  // Create a wrapper function that returns a Promise
  const handleStatusChange = async (status: 'open' | 'in_progress' | 'resolved') => {
    console.log("[TicketDetailView] Changing status to:", status);
    return new Promise<void>((resolve, reject) => {
      try {
        updateStatus(status);
        resolve();
      } catch (error) {
        console.error("[TicketDetailView] Error changing status:", error);
        reject(error);
      }
    });
  };

  if (isLoading) {
    console.log("[TicketDetailView] Loading state");
    return <TicketLoadingState />;
  }

  if (error || !ticket) {
    console.error("[TicketDetailView] Error or no ticket:", error);
    return <TicketErrorState error={error} />;
  }

  console.log("[TicketDetailView] Rendering ticket:", ticket.id, ticket.subject);
  console.log("[TicketDetailView] Messages count:", messages.length);

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <TicketHeader 
        ticket={ticket} 
        userRole={user?.role} 
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
      />
      <CardContent>
        <TicketMessageThread 
          ticket={ticket} 
          messages={messages} 
          currentUserId={user?.id}
          messagesEndRef={messagesEndRef}
        />
        
        <TicketReplyForm
          ticketStatus={ticket.status}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          isReplying={isReplying}
          userRole={user?.role}
        />
      </CardContent>
    </Card>
  );
}
