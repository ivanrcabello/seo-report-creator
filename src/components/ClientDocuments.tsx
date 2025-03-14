
import { useState, useEffect } from "react";
import { ClientDocument } from "@/types/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  File, 
  FileText, 
  Image, 
  PlusCircle,
  Upload,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  FileSearch,
  MessageSquarePlus
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { addClientNote, addDocument, deleteDocument, getClientDocuments } from "@/services/clientService";

interface ClientDocumentsProps {
  clientId: string;
  notes?: string[];
  onNoteAdded?: (notes: string[]) => void;
  onDocumentAdded?: (document: ClientDocument) => void;
  onDocumentDeleted?: (documentId: string) => void;
  onGenerateReport?: (documentIds: string[]) => void;
}

export const ClientDocuments = ({ 
  clientId, 
  notes = [],
  onNoteAdded,
  onDocumentAdded,
  onDocumentDeleted,
  onGenerateReport
}: ClientDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getClientDocuments(clientId);
        setDocuments(docs);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  const getDocumentIcon = (type: ClientDocument['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'doc':
        return <File className="h-4 w-4 text-purple-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: 'pending' | 'processed' | 'failed') => {
    switch (status) {
      case 'processed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-normal gap-1">
            <Check className="h-3 w-3" />
            Procesado
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-normal gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 font-normal gap-1">
            <AlertTriangle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 font-normal gap-1">
            <Clock className="h-3 w-3" />
            Sin analizar
          </Badge>
        );
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newNote.trim()) {
      try {
        const updatedClient = await addClientNote(clientId, newNote.trim());
        
        if (updatedClient && onNoteAdded) {
          onNoteAdded(updatedClient.notes || []);
        }
        
        setNewNote('');
        
        toast({
          title: "Nota añadida",
          description: "La nota se ha guardado correctamente",
        });
      } catch (error) {
        console.error("Error al añadir nota:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar la nota. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (documentFile) {
        // Determinar el tipo de documento basado en la extensión del archivo
        const fileName = documentFile.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        
        let docType: ClientDocument['type'] = 'text';
        if (['pdf'].includes(fileExtension)) {
          docType = 'pdf';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
          docType = 'image';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          docType = 'doc';
        }
        
        // En una implementación real, aquí se subiría el archivo a un servidor
        // y se obtendría la URL. Para la simulación, creamos una URL ficticia
        const mockUrl = `/uploads/${clientId}/${fileName.replace(/\s/g, '_')}`;
        
        const newDocument = await addDocument({
          clientId,
          name: documentName || fileName,
          type: docType,
          url: mockUrl,
          uploadDate: new Date().toISOString(),
          analyzedStatus: 'pending'
        });
        
        setDocuments([...documents, newDocument]);
        
        if (onDocumentAdded) {
          onDocumentAdded(newDocument);
        }
        
        // Resetear formulario
        setDocumentName('');
        setDocumentFile(null);
        
        toast({
          title: "Documento subido",
          description: "El documento se está procesando para análisis",
        });
        
        // Simular procesamiento del documento
        setTimeout(async () => {
          const updatedDoc = {...newDocument, analyzedStatus: 'processed' as const};
          await updateDocument(updatedDoc);
          
          setDocuments(prev => prev.map(doc => 
            doc.id === newDocument.id ? updatedDoc : doc
          ));
          
          toast({
            title: "Documento analizado",
            description: "El documento ha sido procesado correctamente",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error al subir documento:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
      
      if (onDocumentDeleted) {
        onDocumentDeleted(id);
      }
      
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const handleGenerateReport = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "Selecciona documentos",
        description: "Debes seleccionar al menos un documento para generar el informe",
        variant: "destructive",
      });
      return;
    }
    
    if (onGenerateReport) {
      onGenerateReport(selectedDocuments);
    }
  };

  // Función auxiliar para actualizar un documento (simulación)
  const updateDocument = async (document: ClientDocument) => {
    // Esta función es solo para la simulación
    return document;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="flex justify-center items-center p-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
            <span className="ml-2">Cargando documentos...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Documentos del cliente
          </CardTitle>
          <CardDescription>
            Gestiona los documentos subidos para este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No hay documentos disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">{documents.length} documentos</p>
                </div>
                {documents.length > 0 && (
                  <Button onClick={handleGenerateReport} disabled={selectedDocuments.length === 0} className="gap-1">
                    <FileSearch className="h-4 w-4" />
                    Generar Informe ({selectedDocuments.length})
                  </Button>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleToggleDocumentSelection(doc.id)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        {getDocumentIcon(doc.type)}
                        {doc.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(doc.uploadDate), "d MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(doc.analyzedStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Subir nuevo documento</h3>
            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nombre del documento (opcional)"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  className="mt-1"
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !documentFile} className="gap-1">
                {isSubmitting ? (
                  <>Subiendo...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Subir Documento
                  </>
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-purple-600" />
            Notas del cliente
          </CardTitle>
          <CardDescription>
            Añade notas importantes sobre este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-md border border-purple-100">
                    <p className="text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-3">No hay notas para este cliente</p>
            )}
            
            <form onSubmit={handleNoteSubmit} className="space-y-3 mt-4">
              <Textarea
                placeholder="Añadir una nueva nota..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit" disabled={!newNote.trim()} className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Añadir Nota
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
