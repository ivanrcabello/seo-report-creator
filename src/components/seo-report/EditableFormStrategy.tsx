
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { AIReport } from "@/services/aiReportService";

interface EditableFormStrategyProps {
  strategy: AIReport["strategy"];
  onUpdateStrategy: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number, value: string) => void;
  onAddStrategyItem: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding") => void;
  onRemoveStrategyItem: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number) => void;
}

export const EditableFormStrategy = ({
  strategy,
  onUpdateStrategy,
  onAddStrategyItem,
  onRemoveStrategyItem
}: EditableFormStrategyProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estrategia Propuesta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <StrategySection
            title="Optimización Técnica y On-Page"
            items={strategy?.technicalOptimization || []}
            sectionKey="technicalOptimization"
            onUpdate={onUpdateStrategy}
            onAdd={onAddStrategyItem}
            onRemove={onRemoveStrategyItem}
            addButtonLabel="Añadir recomendación técnica"
          />

          <StrategySection
            title="SEO Local y Geolocalización"
            items={strategy?.localSeo || []}
            sectionKey="localSeo"
            onUpdate={onUpdateStrategy}
            onAdd={onAddStrategyItem}
            onRemove={onRemoveStrategyItem}
            addButtonLabel="Añadir recomendación local"
          />

          <StrategySection
            title="Creación de Contenido y Blog"
            items={strategy?.contentCreation || []}
            sectionKey="contentCreation"
            onUpdate={onUpdateStrategy}
            onAdd={onAddStrategyItem}
            onRemove={onRemoveStrategyItem}
            addButtonLabel="Añadir recomendación de contenido"
          />

          <StrategySection
            title="Estrategia de Linkbuilding"
            items={strategy?.linkBuilding || []}
            sectionKey="linkBuilding"
            onUpdate={onUpdateStrategy}
            onAdd={onAddStrategyItem}
            onRemove={onRemoveStrategyItem}
            addButtonLabel="Añadir recomendación de enlaces"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StrategySectionProps {
  title: string;
  items: string[];
  sectionKey: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding";
  onUpdate: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number, value: string) => void;
  onAdd: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding") => void;
  onRemove: (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number) => void;
  addButtonLabel: string;
}

const StrategySection = ({
  title,
  items,
  sectionKey,
  onUpdate,
  onAdd,
  onRemove,
  addButtonLabel
}: StrategySectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Input 
            value={item} 
            onChange={(e) => onUpdate(sectionKey, index, e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(sectionKey, index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        onClick={() => onAdd(sectionKey)} 
        className="w-full mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-2" /> {addButtonLabel}
      </Button>
    </div>
  );
};
