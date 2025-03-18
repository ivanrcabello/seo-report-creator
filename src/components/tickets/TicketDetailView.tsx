
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTicket } from "@/hooks/useTickets";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PriorityBadge } from "./TicketBadges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ChevronLeft, Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function TicketDetailView() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
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

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    
    try {
      await updateStatus(newStatus as 'open' | 'in_progress' | 'resolved');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !ticket) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al cargar el ticket</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "No se pudo cargar la información del ticket."}
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4" 
            variant="secondary"
            onClick={() => navigate('/tickets')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a tickets
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2 -ml-2 text-muted-foreground"
              onClick={() => navigate('/tickets')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver a tickets
            </Button>
            <CardTitle className="text-xl">{ticket.subject}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs">
                {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </CardDescription>
          </div>
          {userRole === 'admin' && (
            <Select 
              value={ticket.status} 
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado del ticket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="in_progress">En progreso</SelectItem>
                <SelectItem value="resolved">Resuelto</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-y-auto p-1">
          {/* Original message */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span className="font-medium">Mensaje inicial</span>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <p>{ticket.message}</p>
          </div>

          {/* Message thread */}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-lg border ${
                msg.sender_id === user?.id 
                  ? 'bg-blue-50 ml-8 border-blue-100' 
                  : 'bg-gray-50 mr-8 border-gray-200'
              }`}
            >
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span className="font-medium">
                  {msg.sender_id === user?.id ? 'Tú' : msg.sender_name || 'Usuario'}
                  {msg.sender_role === 'admin' && ' (Administrador)'}
                </span>
                <span>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <p>{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply form */}
        {ticket.status !== 'resolved' && (
          <div className="mt-6">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <Button 
                onClick={handleSendMessage} 
                disabled={isReplying || !newMessage.trim()}
              >
                {isReplying ? 'Enviando...' : 'Enviar respuesta'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {ticket.status === 'resolved' && (
          <Alert className="mt-4">
            <AlertTitle>Este ticket está resuelto</AlertTitle>
            <AlertDescription>
              No se pueden enviar más mensajes a este ticket.
              {userRole === 'admin' && ' Puedes cambiar el estado para permitir más respuestas.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
