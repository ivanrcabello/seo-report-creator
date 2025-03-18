
import { Badge } from "@/components/ui/badge";

interface TicketStatusBadgeProps {
  status: string;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
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
}
