
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Search, 
  ExternalLink, 
  Calendar, 
  Filter,
  User,
  PlusCircle,
  Globe,
  BarChart,
  Cog,
  Share,
  Loader2
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getAllReports } from "@/services/reportService";
import { getClient } from "@/services/clientService";
import { ClientReport } from "@/types/client";

const AllReports = () => {
  const [reports, setReports] = useState<(ClientReport & { clientName: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const allReports = await getAllReports();
        const reportsWithClientNames = await Promise.all(
          allReports.map(async (report) => {
            const client = await getClient(report.clientId);
            return {
              ...report,
              clientName: client?.name || "Cliente desconocido"
            };
          })
        );
        setReports(reportsWithClientNames);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.url && report.url.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getReportIcon = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'performance':
        return <BarChart className="h-4 w-4 text-purple-500" />;
      case 'technical':
        return <Cog className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Share className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getReportTypeName = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return 'SEO';
      case 'performance':
        return 'Rendimiento';
      case 'technical':
        return 'Técnico';
      case 'social':
        return 'Social';
      default:
        return type;
    }
  };

  const getReportTypeColor = (type: ClientReport['type']) => {
    switch (type) {
      case 'seo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'social':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Todos los Informes</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Informes de Clientes
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="performance">Rendimiento</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar informes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/reports/new">
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Nuevo Informe
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Cargando informes...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No se encontraron informes</p>
              <Link to="/reports/new">
                <Button variant="outline" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Crear Primer Informe
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Informe</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal gap-1 ${getReportTypeColor(report.type)}`}>
                        {getReportIcon(report.type)}
                        {getReportTypeName(report.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/clients/${report.clientId}`} className="text-blue-600 hover:underline flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {report.clientName}
                      </Link>
                    </TableCell>
                    <TableCell className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{format(new Date(report.date), "d MMM yyyy", { locale: es })}</span>
                    </TableCell>
                    <TableCell>
                      {report.url ? (
                        <a 
                          href={report.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1.5 text-sm"
                        >
                          {new URL(report.url).hostname}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Informe
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
