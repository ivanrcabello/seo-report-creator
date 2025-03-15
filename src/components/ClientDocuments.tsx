
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClientDocument } from "@/types/client";
import { FileUploader } from "@/components/FileUploader";
import { getClientDocuments, addDocument, deleteDocument } from "@/services/documentService";
import { File, FileText, MoreVertical, Eye, Trash, Upload, AlertTriangle, CheckCircle, Clock, Map, Image, FilePlus, FileArchive, StickyNote } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { toast as sonnerToast } from "sonner";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"documents" | "notes">("documents");
  const [newNote, setNewNote] = useState("");
  const [clientNotes, setClientNotes] = useState<string[]>(notes);

  useEffect(() => {
    setClientNotes(notes);
  }, [notes]);

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

  const handleFileUpload = async (file: File, content: string, type: "pdf" | "image" | "doc" | "text") => {
    setIsUploading(true);
    try {
      const fileURL = URL.createObjectURL(file);

      const newDocument: Omit<ClientDocument, "id"> = {
        clientId: clientId,
        name: file.name,
        type: type,
        url: fileURL,
        uploadDate: new Date().toISOString(),
        analyzedStatus: "pending",
        content: content,
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

  const handleDocumentDelete = async (documentId: string, documentName: string) => {
    try {
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

  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const handleAnalyzeDocuments = async () => {
    if (onGenerateReport && selectedDocuments.length > 0) {
      setIsGenerating(true);
      
      try {
        sonnerToast("Generando informe...", {
          description: "Analizando los documentos seleccionados...",
          duration: 2000,
        });
        
        // Marcamos documentos como analizados
        const updatedDocs = documents.map(doc => {
          if (selectedDocuments.includes(doc.id)) {
            return { 
              ...doc, 
              analyzedStatus: "analyzed" as "pending" | "analyzed" | "processed" | "failed" | "error" 
            };
          }
          return doc;
        });
        
        setDocuments(updatedDocs);
        
        await new Promise(r => setTimeout(r, 1000)); // Pequeña espera para la animación
        
        // Llamar a la función para generar informe
        onGenerateReport(selectedDocuments);
        
        // Limpiar selección
        setSelectedDocuments([]);
      } catch (error) {
        console.error("Error generating report:", error);
        sonnerToast.error("Error al generar el informe");
      } finally {
        setIsGenerating(false);
      }
    } else {
      sonnerToast.error("Selecciona al menos un documento para generar un informe");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...clientNotes, newNote.trim()];
    setClientNotes(updatedNotes);
    setNewNote("");
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
    
    toast({
      title: "Nota añadida",
      description: "La nota ha sido añadida correctamente.",
    });
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = [...clientNotes];
    updatedNotes.splice(index, 1);
    setClientNotes(updatedNotes);
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
    
    toast({
      title: "Nota eliminada",
      description: "La nota ha sido eliminada correctamente.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Cliente</CardTitle>
        <CardDescription>
          Gestiona los documentos y notas asociados a este cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="documents" value={activeTab} onValueChange={(value) => setActiveTab(value as "documents" | "notes")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="documents" className="flex items-center gap-1.5">
              <FilePlus className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1.5">
              <StickyNote className="h-4 w-4" />
              Notas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-6">
            <FileUploader 
              onFileUpload={handleFileUpload}
              isLoading={isUploading}
              allowedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"]}
              maxSizeMB={25}
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
            )}

            {documents.length > 0 && onGenerateReport && (
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleAnalyzeDocuments} 
                  className="gap-2"
                  disabled={selectedDocuments.length === 0 || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Map className="h-4 w-4" />
                      Generar Informe
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Textarea
                  placeholder="Añade una nueva nota..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="resize-y min-h-[100px]"
                />
                <Button onClick={handleAddNote} className="self-end mt-2">
                  Añadir Nota
                </Button>
              </div>
              
              {clientNotes.length === 0 ? (
                <div className="text-center py-8">
                  <StickyNote className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay notas disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notas ({clientNotes.length})</h3>
                  {clientNotes.map((note, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex">
                        <div className="p-4 flex-grow whitespace-pre-wrap">
                          {note}
                        </div>
                        <div className="p-2 bg-gray-50 flex flex-col items-center justify-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteNote(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;
