
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AmountSummaryProps {
  baseAmount: number | string;
  taxRate: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
}

export const AmountSummary = ({
  baseAmount,
  taxRate,
  taxAmount,
  totalAmount
}: AmountSummaryProps) => {
  // Asegurar que todos los valores sean números para el cálculo y formateo
  const base = typeof baseAmount === 'number' ? baseAmount : parseFloat(baseAmount as string) || 0;
  const tax = typeof taxAmount === 'number' ? taxAmount : parseFloat(taxAmount as string) || 0;
  const total = typeof totalAmount === 'number' ? totalAmount : parseFloat(totalAmount as string) || 0;
  const rate = typeof taxRate === 'number' ? taxRate : parseFloat(taxRate as string) || 0;

  // Formatear números como strings de moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <Card className="md:col-span-2 bg-gray-50">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Resumen de importes</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600">Importe Base:</span>
            <span className="font-medium">{formatCurrency(base)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600">IVA ({rate}%):</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center py-1">
            <span className="text-gray-800 font-medium">Total:</span>
            <span className="text-lg font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
