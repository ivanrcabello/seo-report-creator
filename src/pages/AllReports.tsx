import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllReports } from "@/services/reportService";
import { getClients } from "@/services/clientService";
import { ClientReport, Client } from "@/types/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Calendar,
  User,
  Eye,
  Download,
  Plus,
  Share2,
  AlertTriangle,
  File,
  Building,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AllReports = () => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reportsData = await getAllReports();
        const clientsData = await getClients();
        
        setReports(reportsData);
        setClients(clientsData);
        
        const types = Array.from(new Set(reportsData.map(report => report.type)));
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Cliente Desconocido";
  };

  const filteredReports = reports.filter((report) => {
    const clientName = getClientName(report.clientId).toLowerCase();
    const reportTitle = report.title.toLowerCase();
    const searchTerm = search.toLowerCase();

    return (
      clientName.includes(searchTerm) ||
      reportTitle.includes(searchTerm)
    ) && (selectedType === "" || report.type === selectedType);
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-purple-600" />
          Informes
        </h1>
        <Link to="/reports/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Informe
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Todos los Informes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              type="search"
              placeholder="Buscar informe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-100 rounded mb-4"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No hay informes disponibles</p>
              <Link to="/reports/new">
                <Button variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Crear Primer Informe
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="h-4 w-4 text-gray-500" />
                        {getClientName(report.clientId)}
                      </div>
                    </TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm">
                          {format(new Date(report.date), "d MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReports;
