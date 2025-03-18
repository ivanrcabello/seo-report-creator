
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewTicketDialogContentProps {
  onCancel: () => void;
  onSubmit: (subject: string, message: string, priority: string) => void;
  isSubmitting: boolean;
}

export function NewTicketDialogContent({ 
  onCancel, 
  onSubmit, 
  isSubmitting 
}: NewTicketDialogContentProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<string>("medium");

  const handleSubmit = () => {
    onSubmit(subject, message, priority);
  };

  return (
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
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Asunto del ticket"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">
            Mensaje
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe detalladamente tu consulta o problema"
            rows={5}
          />
        </div>
        <div className="grid gap-2">
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
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar ticket'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
