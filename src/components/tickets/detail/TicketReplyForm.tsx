
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface TicketReplyFormProps {
  ticketStatus: string;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  isReplying: boolean;
  userRole?: string;
}

export function TicketReplyForm({
  ticketStatus,
  newMessage,
  setNewMessage,
  onSendMessage,
  isReplying,
  userRole
}: TicketReplyFormProps) {
  if (ticketStatus === 'resolved') {
    return (
      <Alert className="mt-4">
        <AlertTitle>Este ticket está resuelto</AlertTitle>
        <AlertDescription>
          No se pueden enviar más mensajes a este ticket.
          {userRole === 'admin' && ' Puedes cambiar el estado para permitir más respuestas.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-6">
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Escribe tu respuesta..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end mt-2">
        <Button 
          onClick={onSendMessage} 
          disabled={isReplying || !newMessage.trim()}
        >
          {isReplying ? 'Enviando...' : 'Enviar respuesta'}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
