
import { useState } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface TicketDetailsContentProps {
  ticket: {
    id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    created_at: string;
  } | null;
  messages: TicketMessage[];
  userId?: string;
  newReplyMessage: string;
  setNewReplyMessage: (message: string) => void;
  isReplying: boolean;
  onSendReply: () => void;
}

export function TicketDetailsContent({
  ticket,
  messages,
  userId,
  newReplyMessage,
  setNewReplyMessage,
  isReplying,
  onSendReply
}: TicketDetailsContentProps) {
  if (!ticket) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-500">Abierto</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">En progreso</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resuelto</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-700">Baja</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Media</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-700">Alta</Badge>;
      default:
        return <Badge variant="outline">Desconocida</Badge>;
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>{ticket.subject}</DialogTitle>
        <DialogDescription className="flex items-center gap-2">
          {getStatusBadge(ticket.status)}
          {getPriorityBadge(ticket.priority)}
          <span className="text-xs ml-auto">
            {new Date(ticket.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {/* Original message */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm">{ticket.message}</p>
        </div>

        {/* Message thread */}
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg ${
                message.sender_id === userId 
                  ? 'bg-blue-50 ml-8' 
                  : 'bg-gray-50 mr-8'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(message.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Reply input */}
        {ticket.status !== 'resolved' && (
          <div className="flex items-end gap-2">
            <Textarea
              value={newReplyMessage}
              onChange={(e) => setNewReplyMessage(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="flex-1"
              rows={3}
            />
            <Button 
              size="icon" 
              onClick={onSendReply}
              disabled={isReplying || !newReplyMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
