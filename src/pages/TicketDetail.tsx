
import { TicketDetailView } from "@/components/tickets/detail/TicketDetailView";
import logger from "@/services/advancedLogService";

// Logger específico para TicketDetail
const ticketDetailLogger = logger.getLogger('TicketDetail');

const TicketDetail = () => {
  ticketDetailLogger.info("Rendering ticket detail page");
  
  return <TicketDetailView />;
};

export default TicketDetail;
