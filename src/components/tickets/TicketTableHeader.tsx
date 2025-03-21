
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth";

export function TicketTableHeader() {
  const { userRole } = useAuth();

  return (
    <TableHeader>
      <TableRow>
        {userRole === 'admin' && <TableHead>Cliente</TableHead>}
        <TableHead>Asunto</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead>Prioridad</TableHead>
        <TableHead>Fecha</TableHead>
        <TableHead>Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
