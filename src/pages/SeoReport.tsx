import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { getReportById, updateReport } from "@/services/reportService";
import { ReportForm } from "@/components/reports/ReportForm";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, FileText, Edit, Eye, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PDFViewer } from "@/components/reports/PDFViewer";
import { useForm } from "react-hook-form";
import { extractDataFromReport } from "@/utils/reportUtils";
import { buildReportFromTemplate } from "@/utils/reportBuilder";
import { useAuth } from "@/contexts/auth";

export const SeoReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ClientReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue } = useForm<ClientReport>();
  const reportRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        console.error("No report ID provided");
        setError("No se proporcionó el ID del informe.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedReport = await getReportById(reportId);
        if (fetchedReport) {
          setReport(fetchedReport);

          // Populate the form with the report data
          Object.entries(fetchedReport).forEach(([name, value]) => {
            setValue(name as keyof ClientReport, value);
          });
        } else {
          setError("Informe no encontrado.");
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Error al cargar el informe. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, setValue]);

  const handleSaveReport = async (data: ClientReport) => {
    if (!reportId) {
      console.error("No report ID to update");
      toast.error("No se puede guardar el informe: ID no encontrado.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Ensure the ID is included in the data sent to updateReport
      const reportDataWithId = { ...data, id: reportId };
      const updatedReport = await updateReport(reportId, reportDataWithId);

      if (updatedReport) {
        setReport(updatedReport);
        toast.success("Informe guardado correctamente.");
        setIsEditing(false);
      } else {
        setError("No se pudo guardar el informe.");
        toast.error("No se pudo guardar el informe.");
      }
    } catch (err) {
      console.error("Error updating report:", err);
      setError("Error al guardar el informe. Por favor, inténtalo de nuevo.");
      toast.error("Error al guardar el informe.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewReport = () => {
    setIsEditing(false);
  };

  const handleEditReport = () => {
    setIsEditing(true);
  };

  const handleShareReport = () => {
    setIsShared(true);
    toast.success("Informe compartido exitosamente.");
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      if (!report) {
        console.error("No report data to download");
        toast.error("No hay datos del informe para descargar.");
        return;
      }

      const reportData = extractDataFromReport(report);
      const pdfBlob = await buildReportFromTemplate(reportData);

      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(url);

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${report.title}.pdf`); // Set the filename
        document.body.appendChild(link); // Append to the body
        link.click(); // Simulate a click
        document.body.removeChild(link); // Remove the link after download

        toast.success("Informe descargado correctamente.");
      } else {
        toast.error("No se pudo generar el PDF del informe.");
      }
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
      toast.error("Error al generar o descargar el PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteReport = () => {
    // Implement delete report logic here
    toast.success("Informe eliminado correctamente.");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Cargando informe...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Por favor, espera mientras cargamos la información del informe.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Informe no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>El informe solicitado no existe.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Editar Informe" : report.title}
          </CardTitle>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => navigate("/reports")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            {!isEditing && (
              <>
                <Button variant="outline" onClick={handleEditReport}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" onClick={handleShareReport}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
                <Button variant="outline" onClick={handleDownloadReport} disabled={isDownloading}>
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Descargando..." : "Descargar"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Eliminar</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. ¿Eliminar este informe permanentemente?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteReport}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </CardHeader>
        <CardDescription className="pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span>{report.description}</span>
            <Badge variant="secondary">{report.type}</Badge>
          </div>
        </CardDescription>
        <CardContent>
          <Tabs defaultValue="view" className="w-full">
            <TabsList>
              <TabsTrigger value="view">
                <Eye className="mr-2 h-4 w-4" />
                Ver
              </TabsTrigger>
              {isEditing && (
                <TabsTrigger value="edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="view">
              <ReportViewer report={report} />
            </TabsContent>
            {isEditing && (
              <TabsContent value="edit">
                <ReportForm
                  report={report}
                  onSubmit={handleSubmit(handleSaveReport)}
                  isSaving={isSaving}
                  register={register}
                  onCancel={() => setIsEditing(false)}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          {isEditing && (
            <Button type="submit" onClick={handleSubmit(handleSaveReport)} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M12 2v4M20.59 3.41 18 5.83M22 12h-4M20.59 20.59 18 18.17M12 22v-4M3.41 20.59 5.83 18M2 12h4M3.41 3.41 5.83 5.83" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
