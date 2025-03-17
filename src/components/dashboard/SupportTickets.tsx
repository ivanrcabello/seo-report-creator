
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, Plus, RefreshCw, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<string>("medium");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showTicketDetailsDialog, setShowTicketDetailsDialog] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Error al cargar los tickets de soporte");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTicketMessages(data || []);
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      toast.error("Error al cargar los mensajes del ticket");
    }
  };

  const handleCreateTicket = async () => {
    if (!user) return;

    if (!newTicketSubject.trim()) {
      toast.error("Por favor, introduce un asunto para el ticket");
      return;
    }

    if (!newTicketMessage.trim()) {
      toast.error("Por favor, introduce un mensaje para el ticket");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            client_id: user.id,
            subject: newTicketSubject,
            message: newTicketMessage,
            priority: newTicketPriority
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Ticket creado correctamente");
      setNewTicketSubject("");
      setNewTicketMessage("");
      setNewTicketPriority("medium");
      setShowNewTicketDialog(false);
      
      // Refresh tickets list
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error al crear el ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyToTicket = async () => {
    if (!user || !selectedTicket || !newReplyMessage.trim()) return;

    try {
      setIsReplying(true);
      
      const { error } = await supabase
        .from('ticket_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            sender_id: user.id,
            message: newReplyMessage
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast.success("Respuesta enviada correctamente");
      setNewReplyMessage("");
      
      // Refresh messages
      fetchTicketMessages(selectedTicket.id);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Error al enviar la respuesta");
    } finally {
      setIsReplying(false);
    }
  };

  const openTicketDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchTicketMessages(ticket.id);
    setShowTicketDetailsDialog(true);
  };

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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Tickets de soporte
            </CardTitle>
            <CardDescription>
              Gestiona tus consultas y solicitudes de soporte
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchTickets} 
              disabled={isLoading}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button 
              onClick={() => setShowNewTicketDialog(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Nuevo ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tienes tickets de soporte</p>
              <Button onClick={() => setShowNewTicketDialog(true)}>
                Crear tu primer ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => openTicketDetails(ticket)}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{ticket.message}</p>
                  <div className="text-xs text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo ticket de soporte</DialogTitle>
            <DialogDescription>
              Describe tu consulta o problema para que podamos ayudarte.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Asunto
              </label>
              <Input
                id="subject"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Asunto del ticket"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensaje
              </label>
              <Textarea
                id="message"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                placeholder="Describe detalladamente tu consulta o problema"
                rows={5}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridad
              </label>
              <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateTicket} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetailsDialog} onOpenChange={setShowTicketDetailsDialog}>
        {selectedTicket && (
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedTicket.subject}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <span className="text-xs ml-auto">
                  {new Date(selectedTicket.created_at).toLocaleDateString('es-ES', {
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
                <p className="text-sm">{selectedTicket.message}</p>
              </div>

              {/* Message thread */}
              <div className="space-y-4 mb-4">
                {ticketMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg ${
                      message.sender_id === user?.id 
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
              {selectedTicket.status !== 'resolved' && (
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
                    onClick={handleReplyToTicket}
                    disabled={isReplying || !newReplyMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
