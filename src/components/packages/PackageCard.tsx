
import { SeoPack } from "@/types/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash,
  CheckCircle,
  Euro
} from "lucide-react";

interface PackageCardProps {
  pack: SeoPack;
  onEdit: (pack: SeoPack) => void;
  onDelete: (id: string) => void;
}

export const PackageCard = ({ pack, onEdit, onDelete }: PackageCardProps) => {
  return (
    <Card key={pack.id} className={`border-2 ${!pack.isActive ? 'opacity-70 border-gray-200' : 'border-purple-200'}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{pack.name}</CardTitle>
          {!pack.isActive && (
            <Badge variant="outline" className="bg-gray-100 text-gray-600">Inactivo</Badge>
          )}
        </div>
        <CardDescription className="text-base">{pack.description}</CardDescription>
        <div className="mt-2 text-2xl font-bold text-purple-700 flex items-center">
          <Euro className="h-5 w-5 mr-1" />
          {pack.price.toFixed(2)}
          <span className="text-sm font-normal text-gray-500 ml-1">(IVA incluido)</span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <h4 className="font-semibold mb-2">Características:</h4>
        <ul className="space-y-2">
          {pack.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(pack)}
          className="gap-1"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(pack.id)}
          className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
        >
          <Trash className="h-4 w-4" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};
