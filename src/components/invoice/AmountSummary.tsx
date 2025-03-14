
interface AmountSummaryProps {
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export const AmountSummary = ({ 
  baseAmount, 
  taxRate, 
  taxAmount, 
  totalAmount 
}: AmountSummaryProps) => {
  return (
    <div className="md:col-span-2 p-4 bg-gray-50 rounded-md space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Base Imponible:</span>
        <span className="font-medium">{baseAmount.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">IVA ({taxRate}%):</span>
        <span className="font-medium">{taxAmount.toFixed(2)} €</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-200">
        <span className="text-gray-800 font-semibold">Total:</span>
        <span className="text-blue-700 font-bold text-lg">{totalAmount.toFixed(2)} €</span>
      </div>
    </div>
  );
};
