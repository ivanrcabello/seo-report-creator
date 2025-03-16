
import { useState } from "react";
import { DocumentTemplate, TemplateSection } from "@/types/templates";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTemplate } from "@/services/templateService";
import { toast } from "sonner";
import { Save, X, Plus, Trash2, MoveUp, MoveDown, Code, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SectionEditor } from "./SectionEditor";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateEditorProps {
  template: DocumentTemplate;
  onClose: () => void;
  onUpdate: (template: DocumentTemplate) => void;
}

export const TemplateEditor = ({ template, onClose, onUpdate }: TemplateEditorProps) => {
  const [editedTemplate, setEditedTemplate] = useState<DocumentTemplate>({...template, sections: [...(template.sections || [])]});
  const [activeTab, setActiveTab] = useState("sections");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Manejar cambios en el nombre de la plantilla
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTemplate({...editedTemplate, name: e.target.value});
  };

  // Manejar cambios en los campos de HTML
  const handleHtmlChange = (field: 'headerHtml' | 'footerHtml' | 'coverPageHtml' | 'css', value: string) => {
    setEditedTemplate({...editedTemplate, [field]: value});
  };

  // Añadir una nueva sección
  const handleAddSection = () => {
    const newSection: TemplateSection = {
      id: `section_${Date.now()}`,
      name: "Nueva Sección",
      content: "<h2>Nueva Sección</h2><p>Contenido de la sección...</p>",
      isEnabled: true,
      order: (editedTemplate.sections?.length || 0) + 1
    };
    
    setEditedTemplate({
      ...editedTemplate, 
      sections: [...(editedTemplate.sections || []), newSection]
    });
    
    setSelectedSectionId(newSection.id);
  };

  // Eliminar una sección
  const handleDeleteSection = (sectionId: string) => {
    const updatedSections = editedTemplate.sections?.filter(s => s.id !== sectionId) || [];
    
    // Reordenar las secciones restantes
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setEditedTemplate({
      ...editedTemplate,
      sections: reorderedSections
    });
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  // Mover una sección hacia arriba
  const handleMoveUp = (sectionId: string) => {
    const sectionIndex = editedTemplate.sections?.findIndex(s => s.id === sectionId) || -1;
    if (sectionIndex <= 0) return;
    
    const newSections = [...(editedTemplate.sections || [])];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex - 1];
    newSections[sectionIndex - 1] = temp;
    
    // Actualizar el orden
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setEditedTemplate({
      ...editedTemplate,
      sections: updatedSections
    });
  };

  // Mover una sección hacia abajo
  const handleMoveDown = (sectionId: string) => {
    const sections = editedTemplate.sections || [];
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1 || sectionIndex >= sections.length - 1) return;
    
    const newSections = [...sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex + 1];
    newSections[sectionIndex + 1] = temp;
    
    // Actualizar el orden
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setEditedTemplate({
      ...editedTemplate,
      sections: updatedSections
    });
  };

  // Actualizar una sección
  const handleUpdateSection = (updatedSection: TemplateSection) => {
    const updatedSections = editedTemplate.sections?.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    ) || [];
    
    setEditedTemplate({
      ...editedTemplate,
      sections: updatedSections
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedTemplate = await updateTemplate(editedTemplate.id, editedTemplate);
      if (updatedTemplate) {
        toast.success("Plantilla guardada correctamente");
        onUpdate(updatedTemplate);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Error al guardar la plantilla");
    } finally {
      setIsSaving(false);
    }
  };

  // Obtener la sección seleccionada
  const selectedSection = selectedSectionId 
    ? editedTemplate.sections?.find(s => s.id === selectedSectionId) 
    : null;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Editar Plantilla</DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={isPreviewMode ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-1"
              >
                {isPreviewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isPreviewMode ? "Editar" : "Vista Previa"}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isPreviewMode ? (
          <DialogContent className="p-0 border-0 overflow-auto">
            <TemplatePreview template={editedTemplate} />
          </DialogContent>
        ) : (
          <div className="flex-1 overflow-hidden flex">
            {/* Panel Izquierdo - Lista de Secciones */}
            <div className="w-64 border-r bg-gray-50 p-4 overflow-auto">
              <div className="space-y-4">
                <Input 
                  value={editedTemplate.name} 
                  onChange={handleNameChange} 
                  placeholder="Nombre de la plantilla"
                />
                
                <Button onClick={handleAddSection} className="w-full gap-1">
                  <Plus className="h-4 w-4" />
                  Añadir Sección
                </Button>
                
                <div className="space-y-2">
                  {editedTemplate.sections?.map((section, index) => (
                    <Card 
                      key={section.id} 
                      className={`cursor-pointer transition-all ${selectedSectionId === section.id ? 'border-blue-500' : ''}`}
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span className="truncate">{section.name}</span>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveUp(section.id);
                              }}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveDown(section.id);
                              }}
                              disabled={index === (editedTemplate.sections?.length || 0) - 1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSection(section.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Derecho - Editor */}
            <div className="flex-1 p-6 overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="sections">Secciones</TabsTrigger>
                  <TabsTrigger value="layout">Diseño</TabsTrigger>
                  <TabsTrigger value="styles">Estilos</TabsTrigger>
                </TabsList>

                <TabsContent value="sections" className="mt-4">
                  {selectedSection ? (
                    <SectionEditor 
                      section={selectedSection}
                      onUpdate={handleUpdateSection}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Selecciona una sección para editar su contenido
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="layout" className="mt-4 space-y-6">
                  <div>
                    <Label>Encabezado</Label>
                    <Textarea 
                      value={editedTemplate.headerHtml || ''} 
                      onChange={(e) => handleHtmlChange('headerHtml', e.target.value)}
                      placeholder="HTML del encabezado..."
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label>Pie de Página</Label>
                    <Textarea 
                      value={editedTemplate.footerHtml || ''} 
                      onChange={(e) => handleHtmlChange('footerHtml', e.target.value)}
                      placeholder="HTML del pie de página..."
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label>Portada</Label>
                    <Textarea 
                      value={editedTemplate.coverPageHtml || ''} 
                      onChange={(e) => handleHtmlChange('coverPageHtml', e.target.value)}
                      placeholder="HTML de la portada..."
                      className="font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="styles" className="mt-4">
                  <div>
                    <Label>CSS Personalizado</Label>
                    <Textarea 
                      value={editedTemplate.css || ''} 
                      onChange={(e) => handleHtmlChange('css', e.target.value)}
                      placeholder="Estilos CSS personalizados..."
                      className="font-mono min-h-[400px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        <DialogFooter className="p-4 border-t bg-gray-50">
          <Button onClick={onClose} variant="outline">Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
