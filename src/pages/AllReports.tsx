
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
  Mail,
  Loader2
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const reportsData = await getAllReports();
        const clientsData = await getClients();
        
        setReports(reportsData);
        setClients(clientsData);
        
        // Extraer tipos únicos de informes
        const types = Array.from(
          new Set(reportsData.map(report => report.type))
        ).filter(Boolean); // Eliminar valores vacíos o nulos
        
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Error al cargar los informes");
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
    if (!report || !report.clientId) return false;
    
    const clientName = getClientName(report.clientId).toLowerCase();
    const reportTitle = report.title.toLowerCase();
    const searchTerm = search.toLowerCase();

    return (
      (clientName.includes(searchTerm) ||
      reportTitle.includes(searchTerm)) &&
      (selectedType === "" || report.type === selectedType)
    );
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
            {availableTypes.length > 0 && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "seo" ? "SEO" :
                       type === "performance" ? "Rendimiento" :
                       type === "technical" ? "Técnico" :
                       type === "social" ? "Social" :
                       type === "local-seo" ? "SEO Local" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500">Cargando informes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-2 font-medium">{error}</p>
              <p className="text-gray-500 mb-4">No se pudieron cargar los informes</p>
              <Button 
                variant="outline" 
                className="gap-1"
                onClick={() => window.location.reload()}
              >
                <Plus className="h-4 w-4" />
                Reintentar
              </Button>
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
                    <TableCell>
                      {report.type === "seo" ? "SEO" :
                       report.type === "performance" ? "Rendimiento" :
                       report.type === "technical" ? "Técnico" :
                       report.type === "social" ? "Social" :
                       report.type === "local-seo" ? "SEO Local" : report.type}
                    </TableCell>
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
