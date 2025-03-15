
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditableFormConclusionProps {
  conclusion: string;
  contactEmail: string;
  contactPhone: string;
  onUpdateField: (field: string, value: any) => void;
}

export const EditableFormConclusion = ({
  conclusion,
  contactEmail,
  contactPhone,
  onUpdateField
}: EditableFormConclusionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conclusión y Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="conclusion">Conclusión y siguientes pasos</Label>
            <Textarea 
              id="conclusion" 
              value={conclusion || ""} 
              onChange={(e) => onUpdateField("conclusion", e.target.value)}
              className="min-h-[120px]"
              placeholder="Breve recomendación sobre qué plan elegir según objetivos y presupuesto..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactEmail">Email de contacto</Label>
              <Input 
                id="contactEmail" 
                value={contactEmail || ""} 
                onChange={(e) => onUpdateField("contactEmail", e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Teléfono de contacto</Label>
              <Input 
                id="contactPhone" 
                value={contactPhone || ""} 
                onChange={(e) => onUpdateField("contactPhone", e.target.value)}
                placeholder="+34 123 456 789"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
