
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { AIReport } from "@/services/aiReportService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeoPack } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

interface EditableFormPackagesProps {
  packages: AIReport["packages"];
  availablePacks: SeoPack[];
  isLoadingPacks: boolean;
  onUpdatePackage: (index: number, field: string, value: any) => void;
  onUpdatePackageFeature: (packageIndex: number, featureIndex: number, value: string) => void;
  onAddPackageFeature: (packageIndex: number) => void;
  onRemovePackageFeature: (packageIndex: number, featureIndex: number) => void;
  onAddPackage: () => void;
  onAddPackageFromAvailable: (packId: string) => void;
  onRemovePackage: (index: number) => void;
}

export const EditableFormPackages = ({
  packages,
  availablePacks,
  isLoadingPacks,
  onUpdatePackage,
  onUpdatePackageFeature,
  onAddPackageFeature,
  onRemovePackageFeature,
  onAddPackage,
  onAddPackageFromAvailable,
  onRemovePackage
}: EditableFormPackagesProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planes de Tarifas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Añadir paquete de los disponibles</Label>
          <div className="flex items-center gap-3 mt-2">
            <Select
              disabled={isLoadingPacks || availablePacks.length === 0}
              onValueChange={onAddPackageFromAvailable}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar paquete disponible" />
              </SelectTrigger>
              <SelectContent>
                {availablePacks.map((pack) => (
                  <SelectItem key={pack.id} value={pack.id}>
                    {pack.name} - {pack.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={onAddPackage} 
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Añadir paquete personalizado
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {packages && packages.map((pack, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Paquete #{index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemovePackage(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Nombre del paquete</Label>
                  <Input 
                    value={pack.name} 
                    onChange={(e) => onUpdatePackage(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Precio (€/mes)</Label>
                  <Input 
                    type="number" 
                    value={pack.price} 
                    onChange={(e) => onUpdatePackage(index, "price", Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Características</Label>
                {pack.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 mt-2">
                    <Input 
                      value={feature} 
                      onChange={(e) => onUpdatePackageFeature(index, featureIndex, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemovePackageFeature(index, featureIndex)}
                      disabled={pack.features.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => onAddPackageFeature(index)} 
                  className="w-full mt-3"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Añadir característica
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
