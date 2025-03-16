
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentTemplate, DocumentType } from "@/types/templates";
import { getTemplates, createTemplate, deleteTemplate, setAsDefaultTemplate } from "@/services/templateService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, Check, Star, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const TemplateSettings = () => {
  const navigate = useNavigate();
  const [activeDocType, setActiveDocType] = useState<DocumentType>("seo-report");
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

  // Cargar las plantillas cuando cambie el tipo de documento activo
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      const data = await getTemplates(activeDocType);
      setTemplates(data);
      setIsLoading(false);
    };
    
    loadTemplates();
  }, [activeDocType]);

  // Crear una nueva plantilla
  const handleCreateTemplate = async () => {
    const defaultName = `Nueva Plantilla de ${getDocTypeDisplayName(activeDocType)}`;
    
    const newTemplate: Partial<DocumentTemplate> = {
      name: defaultName,
      documentType: activeDocType,
      isDefault: templates.length === 0, // Si es la primera plantilla, la marcamos como predeterminada
      sections: [],
      headerHtml: "<div>{{companyName}}</div>",
      footerHtml: "<div>Página {{currentPage}} de {{totalPages}}</div>",
      coverPageHtml: "<div style='text-align: center;'><h1>{{reportTitle}}</h1></div>"
    };
    
    const created = await createTemplate(newTemplate);
    if (created) {
      setTemplates([...templates, created]);
      setEditingTemplate(created);
      toast.success("Plantilla creada correctamente");
    }
  };

  // Eliminar una plantilla
  const handleDeleteTemplate = async (template: DocumentTemplate) => {
    const success = await deleteTemplate(template.id);
    if (success) {
      setTemplates(templates.filter(t => t.id !== template.id));
      toast.success("Plantilla eliminada correctamente");
    }
  };

  // Establecer una plantilla como predeterminada
  const handleSetDefault = async (template: DocumentTemplate) => {
    const success = await setAsDefaultTemplate(template.id, template.documentType);
    if (success) {
      setTemplates(templates.map(t => ({
        ...t,
        isDefault: t.id === template.id
      })));
      toast.success("Plantilla establecida como predeterminada");
    }
  };

  // Editar una plantilla
  const handleEditTemplate = (template: DocumentTemplate) => {
    setEditingTemplate(template);
  };

  // Cerrar el editor
  const handleCloseEditor = () => {
    setEditingTemplate(null);
  };

  // Actualizar la lista después de editar
  const handleTemplateUpdated = (updatedTemplate: DocumentTemplate) => {
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  // Obtener el nombre de visualización para cada tipo de documento
  const getDocTypeDisplayName = (docType: DocumentType): string => {
    switch (docType) {
      case "seo-report": return "Informes SEO";
      case "proposal": return "Propuestas";
      case "invoice": return "Facturas";
      case "contract": return "Contratos";
      default: return "Documento";
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-seo-blue to-seo-purple text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Plantillas de Documentos</h1>
          <p className="text-white/80 mt-1">Personaliza el diseño y contenido de los documentos generados por la aplicación</p>
        </div>
        
        <Card className="shadow-md rounded-t-none">
          <CardContent className="p-6">
            <Tabs defaultValue="seo-report" onValueChange={(value) => setActiveDocType(value as DocumentType)}>
              <TabsList className="mb-6 grid grid-cols-4 gap-2">
                <TabsTrigger value="seo-report">Informes SEO</TabsTrigger>
                <TabsTrigger value="proposal">Propuestas</TabsTrigger>
                <TabsTrigger value="invoice">Facturas</TabsTrigger>
                <TabsTrigger value="contract">Contratos</TabsTrigger>
              </TabsList>
              
              {["seo-report", "proposal", "invoice", "contract"].map((docType) => (
                <TabsContent key={docType} value={docType}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Plantillas de {getDocTypeDisplayName(docType as DocumentType)}
                    </h2>
                    <Button onClick={handleCreateTemplate} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nueva Plantilla
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-seo-blue border-t-transparent rounded-full"></div>
                    </div>
                  ) : templates.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No hay plantillas disponibles</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Crea tu primera plantilla de {getDocTypeDisplayName(docType as DocumentType)} para personalizar el aspecto de tus documentos.
                      </p>
                      <Button onClick={handleCreateTemplate} variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Plantilla
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <Card key={template.id} className={`overflow-hidden transition-all ${template.isDefault ? 'border-seo-blue' : ''}`}>
                          <CardHeader className="bg-gray-50 pb-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-seo-blue" />
                                {template.name}
                                {template.isDefault && (
                                  <span className="bg-seo-blue text-white text-xs px-2 py-0.5 rounded">
                                    Predeterminada
                                  </span>
                                )}
                              </CardTitle>
                            </div>
                            <CardDescription>
                              {template.updatedAt && `Última actualización: ${new Date(template.updatedAt).toLocaleDateString()}`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-500 mb-2">
                              {template.sections?.length || 0} secciones configuradas
                            </p>
                            <div className="flex mt-3 gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)} className="gap-1">
                                <Edit className="h-4 w-4" />
                                Editar
                              </Button>
                              {!template.isDefault && (
                                <Button variant="outline" size="sm" onClick={() => handleSetDefault(template)} className="gap-1">
                                  <Star className="h-4 w-4" />
                                  Predeterminada
                                </Button>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 flex justify-end">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1">
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la plantilla "{template.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteTemplate(template)} className="bg-red-500 hover:bg-red-600">
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Editor de Plantillas */}
      {editingTemplate && (
        <TemplateEditor 
          template={editingTemplate} 
          onClose={handleCloseEditor}
          onUpdate={handleTemplateUpdated}
        />
      )}
    </div>
  );
};

export default TemplateSettings;
