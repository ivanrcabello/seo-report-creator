
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientReport } from "@/types/client";
import { getReport, updateReport } from "@/services/reportService";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ChevronLeft, Save, FileText, Edit, Eye, Share2, Download } from "lucide-react";
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
        const fetchedReport = await getReport(reportId);
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

  // Placeholder implementation - this would be replaced with actual UI in a full implementation
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Button>
        
        <div className="flex gap-2">
          {isAdmin && (
            <Button 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Ver informe" : "Editar informe"}
            </Button>
          )}
        </div>
      </div>
      
      {loading ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="ml-2">Cargando informe...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/reports')}
              >
                Volver a informes
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{report?.title || "Informe SEO"}</CardTitle>
            <CardDescription>
              {report?.date && new Date(report.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Contenido del informe SEO</p>
            
            {report && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{report.client?.name || "Sin cliente"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <Badge>{report.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeoReport;
