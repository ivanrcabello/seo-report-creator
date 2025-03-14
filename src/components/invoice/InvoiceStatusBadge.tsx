
import { Badge } from "@/components/ui/badge";
import { Check, Clock, XCircle } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface InvoiceStatusBadgeProps {
  status: Invoice['status'];
}

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  switch (status) {
    case 'paid':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 font-normal gap-1">
          <Check className="h-3.5 w-3.5" />
          Pagada
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-normal gap-1">
          <Clock className="h-3.5 w-3.5" />
          Pendiente
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 font-normal gap-1">
          <XCircle className="h-3.5 w-3.5" />
          Cancelada
        </Badge>
      );
    default:
      return null;
  }
};
