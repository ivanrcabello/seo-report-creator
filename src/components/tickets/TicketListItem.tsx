
import { Badge } from "@/components/ui/badge";

interface TicketListItemProps {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  onClick: (id: string) => void;
}

export function TicketListItem({ 
  id, 
  subject, 
  message, 
  status, 
  priority, 
  created_at, 
  onClick 
}: TicketListItemProps) {
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
    <div 
      key={id} 
      className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick(id)}
    >
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">{subject}</h3>
        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          {getPriorityBadge(priority)}
        </div>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{message}</p>
      <div className="text-xs text-gray-400">
        {new Date(created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
}
