
import { ClientReport } from "@/types/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportsListProps {
  reports: ClientReport[];
  isLoading: boolean;
  error: string | null;
  handleRetry: () => void;
  searchTerm: string;
  selectedType: string;
  setSearchTerm: (value: string) => void;
  setSelectedType: (value: string) => void;
  isAdmin: boolean;
}

export const ReportsList = ({
  reports,
  isLoading,
  error,
  handleRetry,
  searchTerm,
  selectedType,
  setSearchTerm,
  setSelectedType,
  isAdmin,
}: ReportsListProps) => {
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{error}</p>
        <Button variant="outline" onClick={handleRetry} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No se encontraron informes</p>
        {searchTerm || selectedType !== "all" ? (
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setSelectedType("all");
          }}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Tipo</TableHead>
          {isAdmin && <TableHead>Cliente</TableHead>}
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredReports.map(report => (
          <TableRow key={report.id}>
            <TableCell className="font-medium">{report.title}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {report.type || "Sin tipo"}
              </Badge>
            </TableCell>
            {isAdmin && <TableCell>{report.clientId}</TableCell>}
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {format(new Date(report.date), "d MMMM yyyy", { locale: es })}
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                className={
                  report.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  report.status === 'published' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }
              >
                {report.status === 'draft' ? 'Borrador' : 
                 report.status === 'published' ? 'Publicado' : 
                 'Compartido'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Link to={`/reports/${report.id}`}>
                <Button variant="outline" size="sm">Ver Detalle</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
