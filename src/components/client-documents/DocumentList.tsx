
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientDocument } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, MoreVertical, Eye, Trash, Upload, AlertTriangle, CheckCircle, Clock, Image, File, FileArchive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentListProps {
  documents: ClientDocument[];
  selectedDocuments: string[];
  isLoading: boolean;
  toggleDocumentSelection: (documentId: string) => void;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>;
  setDocuments: React.Dispatch<React.SetStateAction<ClientDocument[]>>;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocuments,
  isLoading,
  toggleDocumentSelection,
  setSelectedDocuments,
  setDocuments,
}) => {
  const { toast } = useToast();

  const handleDocumentDelete = async (documentId: string, documentName: string) => {
    try {
      const { deleteDocument } = await import("@/services/documentService");
      await deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc.id !== documentId));
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
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
      case "processed":
        return { 
          badge: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Procesado" 
        };
      case "failed":
        return { 
          badge: "bg-red-100 text-red-800 border-red-200", 
          icon: <AlertTriangle className="h-3 w-3" />,
          text: "Fallido" 
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "doc":
        return <FileArchive className="h-4 w-4" />;
      case "text":
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-100 rounded mb-4"></div>
        <div className="h-20 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-10 w-10 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No hay documentos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          {selectedDocuments.length > 0 ? (
            <span>{selectedDocuments.length} documentos seleccionados</span>
          ) : (
            <span>Selecciona documentos para generar un informe</span>
          )}
        </div>
        
        {selectedDocuments.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDocuments([])}
          >
            Limpiar selección
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => {
          const statusInfo = getStatusInfo(document.analyzedStatus || "pending");
          const isSelected = selectedDocuments.includes(document.id);
          const fileIcon = getFileIcon(document.type);
          
          return (
            <Card 
              key={document.id} 
              className={`relative ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            >
              <div className="absolute top-2 left-2">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => toggleDocumentSelection(document.id)}
                  className="h-4 w-4"
                />
              </div>
              
              <CardHeader className="flex items-center justify-between pt-8">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  {fileIcon}
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
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`font-normal flex gap-1 items-center w-fit ${statusInfo.badge}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.text}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
                    {document.type.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
