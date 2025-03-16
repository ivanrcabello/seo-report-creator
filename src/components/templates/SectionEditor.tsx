
import { TemplateSection } from "@/types/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface SectionEditorProps {
  section: TemplateSection;
  onUpdate: (section: TemplateSection) => void;
}

export const SectionEditor = ({ section, onUpdate }: SectionEditorProps) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  
  const handleChange = (field: keyof TemplateSection, value: any) => {
    onUpdate({
      ...section,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Nombre de la Sección</Label>
          <Input 
            value={section.name} 
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nombre de la sección..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Activa</Label>
          <Switch 
            checked={section.isEnabled}
            onCheckedChange={(checked) => handleChange("isEnabled", checked)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <TabsList className="mb-2">
          <TabsTrigger value="edit">Editar HTML</TabsTrigger>
          <TabsTrigger value="preview">Vista Previa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit">
          <Label>Contenido HTML</Label>
          <Textarea 
            value={section.content} 
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Contenido HTML de la sección..."
            className="font-mono min-h-[400px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Variables disponibles: {{clientName}}, {{companyName}}, {{reportTitle}}, {{reportDate}}, etc.
          </p>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="border rounded-md p-6 min-h-[400px] bg-white">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
