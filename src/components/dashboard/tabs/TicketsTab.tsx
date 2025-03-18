
import { useTickets } from "@/hooks/useTickets";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface TicketsTabProps {
  clientId?: string;
}

export function TicketsTab({ clientId }: TicketsTabProps) {
  const { user, userRole } = useAuth();
  const { tickets, isLoading, error, createTicket } = useTickets(clientId);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState<string>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTicket = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await createTicket({
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: newTicketPriority as 'low' | 'medium' | 'high'
      });
      setShowNewTicketDialog(false);
      setNewTicketSubject("");
      setNewTicketMessage("");
      setNewTicketPriority("medium");
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar los tickets
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Tickets de soporte</h2>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' ? 'Gestiona los tickets de soporte' : 'Gestiona tus tickets de soporte'}
          </p>
        </div>
        <Button onClick={() => setShowNewTicketDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {userRole === 'admin' && <TableHead>Cliente</TableHead>}
            <TableHead>Asunto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              {userRole === 'admin' && <TableCell>{ticket.client_id}</TableCell>}
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo ticket de soporte</DialogTitle>
            <DialogDescription>
              Describe tu consulta o problema para que podamos ayudarte.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Asunto
              </label>
              <Input
                id="subject"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Asunto del ticket"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
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
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
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
            <Button onClick={handleCreateTicket} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Crear ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
