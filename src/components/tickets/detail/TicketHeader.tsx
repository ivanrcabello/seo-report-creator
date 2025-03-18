
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "../TicketBadges";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TicketStatusSelector } from "./TicketStatusSelector";

interface TicketHeaderProps {
  ticket: {
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  };
  userRole?: string;
  onStatusChange: (status: 'open' | 'in_progress' | 'resolved') => Promise<void>;
  isUpdatingStatus: boolean;
}

export function TicketHeader({ 
  ticket, 
  userRole, 
  onStatusChange,
  isUpdatingStatus
}: TicketHeaderProps) {
  const navigate = useNavigate();

  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={() => navigate('/tickets')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a tickets
          </Button>
          <CardTitle className="text-xl">{ticket.subject}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs">
              {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </CardDescription>
        </div>
        {userRole === 'admin' && (
          <TicketStatusSelector 
            currentStatus={ticket.status} 
            onStatusChange={onStatusChange}
            isUpdating={isUpdatingStatus}
          />
        )}
      </div>
    </CardHeader>
  );
}
