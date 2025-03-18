
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash2, Save, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { DocumentTemplate, DocumentType } from "@/types/templates";
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, setAsDefaultTemplate } from "@/services/templateService";

export default function TemplateSettings() {
  const [activeTab, setActiveTab] = useState<DocumentType>("proposal");
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    isDefault: false,
    sections: [] as any[],
    headerHtml: "",
    footerHtml: "",
    css: ""
  });

  useEffect(() => {
    loadTemplates(activeTab);
  }, [activeTab]);

  const loadTemplates = async (type: DocumentType) => {
    setLoading(true);
    try {
      const data = await getTemplates(type);
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Error al cargar las plantillas");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as DocumentType);
    setEditMode(false);
    setCurrentTemplate(null);
  };

  const handleCreateNew = () => {
    setCurrentTemplate(null);
    setFormData({
      name: "",
      isDefault: false,
      sections: [{ id: crypto.randomUUID(), name: "Nueva Sección", content: "", isEnabled: true, order: 0 }],
      headerHtml: "",
      footerHtml: "",
      css: ""
    });
    setEditMode(true);
  };

  const handleEdit = (template: DocumentTemplate) => {
    setCurrentTemplate(template);
    setFormData({
      name: template.name,
      isDefault: template.isDefault,
      sections: template.sections || [],
      headerHtml: template.headerHtml || "",
      footerHtml: template.footerHtml || "",
      css: template.css || ""
    });
    setEditMode(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
      try {
        await deleteTemplate(id);
        toast.success("Plantilla eliminada con éxito");
        loadTemplates(activeTab);
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("Error al eliminar la plantilla");
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setAsDefaultTemplate(id, activeTab);
      toast.success("Plantilla establecida como predeterminada");
      loadTemplates(activeTab);
    } catch (error) {
      console.error("Error setting default template:", error);
      toast.error("Error al establecer la plantilla como predeterminada");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isDefault: checked }));
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const addSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      name: "Nueva Sección",
      content: "",
      isEnabled: true,
      order: formData.sections.length
    };
    setFormData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (index: number) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("El nombre de la plantilla es obligatorio");
      return;
    }

    try {
      if (currentTemplate) {
        // Update existing template
        await updateTemplate(currentTemplate.id, {
          ...formData,
          documentType: activeTab
        });
        toast.success("Plantilla actualizada con éxito");
      } else {
        // Create new template
        await createTemplate({
          ...formData,
          documentType: activeTab
        });
        toast.success("Plantilla creada con éxito");
      }
      
      setEditMode(false);
      loadTemplates(activeTab);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Error al guardar la plantilla");
    }
  };

  const renderTemplatesList = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <div className="text-center py-10">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No hay plantillas disponibles para este tipo de documento</p>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Primera Plantilla
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {template.name}
                    {template.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Última actualización: {new Date(template.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {template.sections?.length || 0} secciones
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-3">
              <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              {!template.isDefault && (
                <Button variant="outline" size="sm" onClick={() => handleSetDefault(template.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Usar como predeterminada
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderTemplateForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la plantilla</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Ej: Plantilla de contrato estándar" 
              required 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="isDefault" 
              checked={formData.isDefault} 
              onCheckedChange={handleSwitchChange} 
            />
            <Label htmlFor="isDefault">Establecer como plantilla predeterminada</Label>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Secciones de la plantilla</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir sección
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <Card key={section.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Input 
                        value={section.name} 
                        onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                        placeholder="Nombre de la sección"
                        className="font-medium"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeSection(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={section.content} 
                      onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                      placeholder="Contenido de la sección"
                      rows={5}
                    />
                    <div className="flex items-center mt-2">
                      <Switch 
                        id={`section-enabled-${index}`} 
                        checked={section.isEnabled} 
                        onCheckedChange={(checked) => handleSectionChange(index, 'isEnabled', checked)} 
                      />
                      <Label htmlFor={`section-enabled-${index}`} className="ml-2">Habilitada</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="headerHtml">HTML de la cabecera</Label>
            <Textarea 
              id="headerHtml" 
              name="headerHtml" 
              value={formData.headerHtml} 
              onChange={handleChange} 
              placeholder="HTML para la cabecera del documento"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="footerHtml">HTML del pie de página</Label>
            <Textarea 
              id="footerHtml" 
              name="footerHtml" 
              value={formData.footerHtml} 
              onChange={handleChange} 
              placeholder="HTML para el pie de página del documento"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="css">CSS personalizado</Label>
            <Textarea 
              id="css" 
              name="css" 
              value={formData.css} 
              onChange={handleChange} 
              placeholder="Estilos CSS personalizados para el documento"
              rows={5}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Guardar plantilla
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <SettingsNavigation />
      
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Plantillas de documentos</CardTitle>
              <CardDescription>
                Gestiona las plantillas para tus propuestas, contratos e informes
              </CardDescription>
            </div>
            {!editMode && (
              <Button onClick={handleCreateNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nueva plantilla
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proposal" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="proposal">Propuestas</TabsTrigger>
              <TabsTrigger value="contract">Contratos</TabsTrigger>
              <TabsTrigger value="seo-report">Informes</TabsTrigger>
            </TabsList>
            
            <div className="p-4 border rounded-md">
              {editMode ? renderTemplateForm() : renderTemplatesList()}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
