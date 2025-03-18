
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TicketStatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: 'open' | 'in_progress' | 'resolved') => Promise<void>;
  isUpdating: boolean;
}

export function TicketStatusSelector({ 
  currentStatus, 
  onStatusChange, 
  isUpdating 
}: TicketStatusSelectorProps) {
  const handleStatusChange = (value: string) => {
    onStatusChange(value as 'open' | 'in_progress' | 'resolved');
  };

  return (
    <Select 
      value={currentStatus} 
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Estado del ticket" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Abierto</SelectItem>
        <SelectItem value="in_progress">En progreso</SelectItem>
        <SelectItem value="resolved">Resuelto</SelectItem>
      </SelectContent>
    </Select>
  );
}
