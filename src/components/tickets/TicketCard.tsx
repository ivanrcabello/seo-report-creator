
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isLoading: boolean;
  onRefresh: () => void;
  onNewTicket: () => void;
}

export function TicketCard({ 
  title, 
  description, 
  children, 
  isLoading, 
  onRefresh, 
  onNewTicket 
}: TicketCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={onNewTicket}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Nuevo ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
