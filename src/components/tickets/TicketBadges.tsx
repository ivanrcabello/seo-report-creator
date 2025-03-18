
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

interface PriorityBadgeProps {
  priority: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
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

export function PriorityBadge({ priority }: PriorityBadgeProps) {
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
