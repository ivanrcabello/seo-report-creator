
import { Badge } from "@/components/ui/badge";

interface TicketPriorityBadgeProps {
  priority: string;
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
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
}
