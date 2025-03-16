
import { TemplateSection } from "@/types/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SectionEditorProps {
  section: TemplateSection;
  onUpdate: (section: TemplateSection) => void;
}

export const SectionEditor = ({ section, onUpdate }: SectionEditorProps) => {
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
      
      <div>
        <Label>Contenido HTML</Label>
        <Textarea 
          value={section.content} 
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Contenido HTML de la sección..."
          className="font-mono min-h-[400px]"
        />
      </div>
    </div>
  );
};
