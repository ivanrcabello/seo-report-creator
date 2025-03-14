
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, FileText, Send, XCircle } from "lucide-react";

interface ProposalStatusBadgeProps {
  status: string;
  expired?: boolean;
}

export const ProposalStatusBadge = ({ status, expired = false }: ProposalStatusBadgeProps) => {
  // Function to obtain status information
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return {
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <FileText className="h-4 w-4" />,
          text: "Borrador",
        };
      case "sent":
        return {
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Send className="h-4 w-4" />,
          text: "Enviada",
        };
      case "accepted":
        return {
          badge: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Aceptada",
        };
      case "rejected":
        return {
          badge: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          text: "Rechazada",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800",
          icon: <FileText className="h-4 w-4" />,
          text: status,
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <>
      <Badge 
        variant="outline" 
        className={`font-normal gap-1 ${statusInfo.badge}`}
      >
        {statusInfo.icon}
        {statusInfo.text}
      </Badge>
      
      {expired && (
        <Badge 
          variant="outline" 
          className="font-normal gap-1 bg-amber-100 text-amber-800 border-amber-200"
        >
          <AlertTriangle className="h-4 w-4" />
          Expirada
        </Badge>
      )}
    </>
  );
};
