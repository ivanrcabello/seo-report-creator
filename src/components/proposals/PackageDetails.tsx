
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pack } from "@/types/client";

interface PackageDetailsProps {
  pack: Pack;
  customPrice?: number;
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({ pack, customPrice }) => {
  const displayPrice = customPrice !== undefined ? customPrice : pack.price;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{pack.name}</CardTitle>
          <Badge variant="secondary" className="text-lg font-bold">
            {displayPrice}€
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{pack.description}</p>
        
        {pack.features && pack.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Características</h3>
            <ul className="space-y-2">
              {pack.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {customPrice !== undefined && customPrice !== pack.price && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Nota:</span> Este paquete tiene un precio personalizado.
              <br />
              Precio original: <span className="line-through">{pack.price}€</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
