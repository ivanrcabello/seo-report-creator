
import { RefObject } from "react";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

interface TicketMessageThreadProps {
  ticket: {
    message: string;
    created_at: string;
  };
  messages: Message[];
  currentUserId?: string;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function TicketMessageThread({ 
  ticket, 
  messages, 
  currentUserId,
  messagesEndRef
}: TicketMessageThreadProps) {
  return (
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
            msg.sender_id === currentUserId 
              ? 'bg-blue-50 ml-8 border-blue-100' 
              : 'bg-gray-50 mr-8 border-gray-200'
          }`}
        >
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span className="font-medium">
              {msg.sender_id === currentUserId ? 'Tú' : msg.sender_name || 'Usuario'}
              {msg.sender_role === 'admin' && ' (Administrador)'}
            </span>
            <span>{new Date(msg.created_at).toLocaleString()}</span>
          </div>
          <p>{msg.message}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
