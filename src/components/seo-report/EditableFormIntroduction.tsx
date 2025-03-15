
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface EditableFormIntroductionProps {
  introduction: string;
  onUpdate: (value: string) => void;
}

export const EditableFormIntroduction = ({ 
  introduction, 
  onUpdate 
}: EditableFormIntroductionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introducción</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="introduction">Texto de introducción</Label>
            <Textarea 
              id="introduction" 
              value={introduction || ""} 
              onChange={(e) => onUpdate(e.target.value)}
              className="min-h-[120px]"
              placeholder="Describe brevemente la empresa del cliente y el propósito del informe..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
