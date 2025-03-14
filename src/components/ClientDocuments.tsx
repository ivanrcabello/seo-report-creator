import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ClientDocument } from "@/types/client";
import { PdfUploader } from "@/components/PdfUploader";
import { getClientDocuments, addDocument, deleteDocument } from "@/services/documentService";
import { pdfToText } from "@/services/pdfAnalyzer";
import { File, FileText, MoreVertical, Eye, Trash, Upload, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AuditResult } from "@/services/pdfAnalyzer";

interface ClientDocumentsProps {
  clientId: string;
  notes?: string[];
  onNoteAdded?: (updatedNotes: string[]) => void;
  onGenerateReport?: (documentIds: string[]) => void;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ 
  clientId, 
  notes = [],
  onNoteAdded,
  onGenerateReport 
}) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const fetchedDocuments = await getClientDocuments(clientId);
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId, toast]);

  const handleDocumentUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileURL = URL.createObjectURL(file);
      const textContent = await pdfToText(fileURL);

      const newDocument: Omit<ClientDocument, "id"> = {
        clientId: clientId,
        name: file.name,
        type: "pdf", // Must match the allowed enum values
        url: fileURL,
        uploadDate: new Date().toISOString(),
        analyzedStatus: "pending",
        content: textContent,
      };

      const uploadedDocument = await addDocument(newDocument);
      setDocuments([...documents, uploadedDocument]);
      toast({
        title: "Documento subido",
        description: `${file.name} ha sido subido correctamente.`,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalysisResult = (result: AuditResult) => {
    console.log("Audit result received:", result);
  };

  const handleDocumentDelete = async (documentId: string, documentName: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc.id !== documentId));
      toast({
        title: "Documento eliminado",
        description: `${documentName} ha sido eliminado correctamente.`,
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          badge: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: <Clock className="h-3 w-3" />,
          text: "Pendiente" 
        };
      case "analyzed":
        return { 
          badge: "bg-green-100 text-green-800 border-green-200", 
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Analizado" 
        };
      case "error":
        return { 
          badge: "bg-red-100 text-red-800 border-red-200", 
          icon: <AlertTriangle className="h-3 w-3" />,
          text: "Error" 
        };
      default:
        return { 
          badge: "bg-gray-100 text-gray-800", 
          icon: <FileText className="h-3 w-3" />,
          text: status 
        };
    }
  };

  const handleAnalyzeDocuments = () => {
    if (onGenerateReport && selectedDocuments.length > 0) {
      onGenerateReport(selectedDocuments);
    } else {
      toast({
        title: "Selecciona documentos",
        description: "Debes seleccionar al menos un documento para generar un informe.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Cliente</CardTitle>
        <CardDescription>
          Gestiona los documentos asociados a este cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PdfUploader 
          onAnalysisComplete={handleAnalysisResult} 
          isLoading={isUploading} 
        />

        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-100 rounded mb-4"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hay documentos disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => {
              const statusInfo = getStatusInfo(document.analyzedStatus);
              return (
                <Card key={document.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-1">
                      <File className="h-4 w-4" />
                      {document.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => window.open(document.url, "_blank")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDocumentDelete(document.id, document.name)} className="text-red-500 focus:text-red-500">
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      Subido el {format(new Date(document.uploadDate), "d MMM yyyy", { locale: es })}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 font-normal flex gap-1 items-center w-fit ${statusInfo.badge}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.text}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {documents.length > 0 && onGenerateReport && (
          <div className="flex justify-end mt-6">
            <Button onClick={handleAnalyzeDocuments} className="gap-1">
              <FileText className="h-4 w-4" />
              Generar Informe
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;
