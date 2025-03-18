
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth";
import { createTicket } from "@/services/ticketService";
import { toast } from "sonner";

export default function NewTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("No se ha podido identificar el usuario");
      return;
    }
    
    if (!subject.trim()) {
      toast.error("Por favor, introduce un asunto para el ticket");
      return;
    }

    if (!message.trim()) {
      toast.error("Por favor, introduce un mensaje para el ticket");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createTicket(
        user.id,
        subject,
        message,
        priority as 'low' | 'medium' | 'high'
      );
      
      if (result) {
        toast.success("Ticket creado correctamente");
        navigate("/tickets");
      } else {
        toast.error("Error al crear el ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error al crear el ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear nuevo ticket de soporte</CardTitle>
          <CardDescription>
            Describe tu consulta o problema para que podamos ayudarte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Asunto
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Asunto del ticket"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensaje
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe detalladamente tu consulta o problema"
                rows={6}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Prioridad
              </label>
              <Select value={priority} onValueChange={setPriority}>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/tickets")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
