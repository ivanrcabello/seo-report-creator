
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ticket } from '@/services/ticketService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface TicketTableRowProps {
  ticket: Ticket;
}

export const TicketTableRow = ({ ticket }: TicketTableRowProps) => {
  // Formatear la fecha
  const formattedDate = format(new Date(ticket.created_at), 'dd MMM yyyy, HH:mm', { locale: es });
  
  // Mapeo de estados a colores
  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };
  
  // Mapeo de prioridades a colores
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800'
  };
  
  // Traducción de estados
  const statusText = {
    open: 'Abierto',
    in_progress: 'En progreso',
    resolved: 'Resuelto'
  };
  
  // Traducción de prioridades
  const priorityText = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="truncate max-w-xs">
          <Link 
            to={`/tickets/${ticket.id}`} 
            className="text-sm font-medium text-gray-900 hover:text-purple-600"
          >
            {ticket.subject}
          </Link>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
          {statusText[ticket.status as keyof typeof statusText]}
        </Badge>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
          {priorityText[ticket.priority as keyof typeof priorityText]}
        </Badge>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedDate}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="hover:bg-purple-50 hover:text-purple-700"
        >
          <Link to={`/tickets/${ticket.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Link>
        </Button>
      </td>
    </tr>
  );
};
