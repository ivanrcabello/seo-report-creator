
import React from "react";
import { CheckCircle, Euro, Package } from "lucide-react";
import { SeoPack } from "@/types/client";

interface PackageDetailsProps {
  pack: SeoPack;
  customPrice?: number;
  customFeatures?: string[];
}

export const PackageDetails = ({ pack, customPrice, customFeatures }: PackageDetailsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Package className="h-5 w-5 text-purple-600" />
        Paquete: {pack.name}
      </h3>
      <p className="text-gray-600 mb-4">{pack.description}</p>
      
      <div className="mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Precio base:</span>
          <span className="font-medium">{pack.price.toFixed(2)} €</span>
          <span className="text-xs text-gray-500 ml-1">(IVA incluido)</span>
        </div>
        
        {customPrice !== undefined && (
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500 mr-2">Precio personalizado:</span>
            <span className="font-bold text-xl text-purple-700">{customPrice.toFixed(2)} €</span>
            <span className="text-xs text-gray-500 ml-1">(IVA incluido)</span>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Características incluidas:</h4>
        <ul className="space-y-2">
          {(customFeatures || pack.features).map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
