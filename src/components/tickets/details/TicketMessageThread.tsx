
interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface TicketMessageThreadProps {
  messages: TicketMessage[];
  userId?: string;
}

export function TicketMessageThread({ messages, userId }: TicketMessageThreadProps) {
  return (
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
  );
}
