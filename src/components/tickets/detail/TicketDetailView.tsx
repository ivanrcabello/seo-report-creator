
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
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user } = useAuth();
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
    
    try {
      await reply({
        senderId: user.id,
        message: newMessage.trim()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Create a wrapper function that returns a Promise
  const handleStatusChange = async (status: 'open' | 'in_progress' | 'resolved') => {
    return new Promise<void>((resolve, reject) => {
      try {
        updateStatus(status);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  if (isLoading) {
    return <TicketLoadingState />;
  }

  if (error || !ticket) {
    return <TicketErrorState error={error} />;
  }

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
