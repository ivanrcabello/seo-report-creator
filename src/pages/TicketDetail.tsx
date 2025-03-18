
import { TicketDetailView } from "@/components/tickets/detail/TicketDetailView";
import logger from "@/services/advancedLogService";

// Logger for TicketDetail
const ticketDetailLogger = logger.getLogger('TicketDetail');

const TicketDetail = () => {
  try {
    ticketDetailLogger.info("Rendering ticket detail page");
    return <TicketDetailView />;
  } catch (error) {
    ticketDetailLogger.error("Error rendering ticket detail", { error });
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-800 font-semibold">Error al cargar detalles del ticket</h2>
          <p className="text-red-700">Por favor, intenta recargar la página o regresa más tarde.</p>
        </div>
      </div>
    );
  }
};

export default TicketDetail;
