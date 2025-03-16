
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { getAllReports } from "@/services/reportService";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Filter, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AllReports = () => {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allReports = await getAllReports();
      console.log("Informes cargados:", allReports);
      setReports(allReports);
      
      // Extract unique report types and filter out any empty or null values
      const types = Array.from(new Set(allReports.map(report => report.type)))
        .filter(Boolean) as string[];
      setReportTypes(types);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("No se pudieron cargar los informes. Por favor, inténtalo de nuevo más tarde.");
      toast.error("No se pudieron cargar los informes.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadReports();
  }, []);
  
  // Filter reports based on search and type
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "" || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRetry = () => {
    loadReports();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          Todos los Informes
        </h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Encuentra informes específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-10"
                  placeholder="Buscar por título..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {reportTypes.map(type => (
                    <SelectItem key={type} value={type}>{type || "Sin tipo"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informes ({filteredReports.length})</CardTitle>
            {!isLoading && (
              <Button variant="outline" size="sm" onClick={handleRetry} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            )}
          </div>
          <CardDescription>Lista completa de informes generados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">{error}</p>
              <Button variant="outline" onClick={handleRetry} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No se encontraron informes</p>
              {searchTerm || selectedType ? (
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedType("");
                }}>
                  Limpiar filtros
                </Button>
              ) : null}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
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
                    <TableCell>{report.clientId}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllReports;
