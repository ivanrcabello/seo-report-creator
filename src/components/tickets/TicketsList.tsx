
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TicketTableHeader } from "./TicketTableHeader";
import { TicketTableRow } from "./TicketTableRow";
import { Ticket } from "@/services/ticketService";
import { Pagination } from "@/components/ui/pagination";

interface TicketsListProps {
  tickets: Ticket[];
}

export const TicketsList = ({ tickets }: TicketsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  
  // Log para depuración
  useEffect(() => {
    console.log("Tickets in TicketsList:", tickets);
  }, [tickets]);
  
  // Calcular tickets paginados
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  
  // Cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Calcular el número total de páginas
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  return (
    <div className="overflow-hidden">
      {tickets.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-4">No hay tickets de soporte</p>
          <Link 
            to="/tickets/new" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Crear nuevo ticket
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <TicketTableHeader />
              <tbody>
                {currentTickets.map((ticket) => (
                  <TicketTableRow key={ticket.id} ticket={ticket} />
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
