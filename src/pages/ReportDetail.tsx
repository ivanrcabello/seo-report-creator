import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getReport, deleteReport, updateReport } from "@/services/reportService";
import { getClient } from "@/services/clientService";
import { getSharedReportUrl } from "@/services/reportSharingService";
import { Client, ClientReport } from "@/types/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash,
  FileText,
  User,
  Calendar,
  Link as LinkIcon,
  ClipboardCopy,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (sharedUrl) {
      navigator.clipboard.writeText(sharedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDeleteReport = async () => {
    if (id) {
      try {
        await deleteReport(id);
        toast.success("Informe eliminado correctamente");
        navigate("/reports");
      } catch (error) {
        console.error("Error al eliminar el informe:", error);
        toast.error("Error al eliminar el informe");
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const reportData = await getReport(id);
          if (reportData) {
            setReport(reportData);
            
            // Obtener detalles del cliente
            const clientData = await getClient(reportData.clientId);
            if (clientData) {
              setClient(clientData);
            }
            
            // Obtener URL compartida si existe
            if (reportData.shareToken) {
              const shareUrl = await getSharedReportUrl(reportData.id);
              setSharedUrl(shareUrl);
            }
          } else {
            toast.error("No se encontró el informe");
            navigate("/reports");
          }
        }
      } catch (error) {
        console.error("Error cargando informe:", error);
        toast.error("Error al cargar el informe");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReportData();
  }, [id, navigate]);

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando informe...</div>;
  }

  if (!report || !client) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Informe no encontrado</h1>
          <p className="mb-4">El informe que estás buscando no existe o no está disponible.</p>
          <Button onClick={() => navigate("/reports")} variant="outline">
            Volver a Informes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/reports")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Detalles del Informe
          </h1>
        </div>
        <div>
          {sharedUrl ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={isCopied} className="gap-1">
                {isCopied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                {isCopied ? "Copiado!" : "Copiar Enlace"}
              </Button>
              <a href={sharedUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1">
                  <LinkIcon className="h-4 w-4" />
                  Ver Informe Compartido
                </Button>
              </a>
            </div>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Generando enlace...
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{report.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                Informe de {report.type} para {client.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Cliente</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{client.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(report.date), "d MMMM yyyy", { locale: es })}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Informe</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Tipo: {report.type}</span>
                    </div>
                    {report.url && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-500" />
                        <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Ver Documento
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Notas Adicionales</h3>
                <p className="text-gray-600">{report.notes || "No hay notas adicionales para este informe."}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-1 text-destructive border-destructive hover:bg-destructive/10">
                      <Trash className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente este informe.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteReport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/reports/edit/${report.id}`)} className="gap-1">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                <p className="font-medium">{client.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{client.email}</p>
              </div>
              {client.phone && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                  <p>{client.phone}</p>
                </div>
              )}
              <div className="pt-2">
                <Link to={`/clients/${client.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Perfil del Cliente
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
