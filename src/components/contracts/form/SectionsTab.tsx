
import { useState } from "react";
import { ContractSection } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface SectionsTabProps {
  sections: ContractSection[];
  onChange: (sections: ContractSection[]) => void;
}

export const SectionsTab = ({ sections, onChange }: SectionsTabProps) => {
  const addSection = () => {
    const newOrder = sections.length ? Math.max(...sections.map(s => s.order)) + 1 : 1;
    onChange([
      ...sections,
      {
        title: "",
        content: "",
        order: newOrder,
      },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    onChange(newSections);
  };

  const updateSection = (index: number, field: keyof ContractSection, value: string | number) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    onChange(newSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Secciones del Contrato</h3>
        <Button 
          type="button" 
          variant="outline"
          onClick={addSection}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Añadir Sección
        </Button>
      </div>
      
      {sections.map((section, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-start">
              <Input
                placeholder="Título de la sección"
                value={section.title}
                onChange={(e) => updateSection(index, "title", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSection(index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Contenido de la sección"
              value={section.content}
              onChange={(e) => updateSection(index, "content", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      ))}
      
      {sections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay secciones en el contrato.</p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addSection}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir primera sección
          </Button>
        </div>
      )}
    </div>
  );
};
