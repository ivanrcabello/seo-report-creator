
import { useEffect } from "react";
import { TicketDetailView } from "@/components/tickets/detail";

export default function TicketDetail() {
  useEffect(() => {
    console.log("[TicketDetail] Page rendered");
  }, []);
  
  return <TicketDetailView />;
}
