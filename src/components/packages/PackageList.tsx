
import { SeoPack } from "@/types/client";
import { PackageCard } from "./PackageCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PackageListProps {
  packages: SeoPack[];
  isLoading: boolean;
  onEdit: (pack: SeoPack) => void;
  onDelete: (pack: SeoPack) => void;
  onCreate: () => void;
}

export const PackageList = ({ packages, isLoading, onEdit, onDelete, onCreate }: PackageListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-100 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-gray-500 mb-4">No hay paquetes disponibles</p>
          <Button onClick={onCreate} variant="outline" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Crear Primer Paquete
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pack) => (
        <PackageCard 
          key={pack.id}
          pack={pack} 
          onEdit={() => onEdit(pack)} 
          onDelete={() => onDelete(pack)} 
        />
      ))}
    </div>
  );
};
