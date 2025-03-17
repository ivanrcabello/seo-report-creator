
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/invoice";

interface StatusBadgeProps {
  status: Invoice['status'];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800"
  };
  
  const color = statusColors[status] || statusColors.draft;
  
  return (
    <Badge className={color}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
