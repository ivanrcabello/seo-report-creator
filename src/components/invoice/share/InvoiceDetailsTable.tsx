
import { Invoice } from "@/types/invoice";

interface InvoiceDetailsTableProps {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
}

export const InvoiceDetailsTable = ({ invoice, formatCurrency }: InvoiceDetailsTableProps) => {
  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Concepto</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">
              <div>
                <p className="font-medium">
                  Servicios Profesionales
                </p>
                {invoice.notes && <p className="text-sm text-gray-500 mt-1">{invoice.notes}</p>}
              </div>
            </td>
            <td className="px-4 py-3 text-right font-medium">
              {formatCurrency(invoice.baseAmount)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-right text-sm font-medium text-gray-600">Base Imponible</td>
            <td className="px-4 py-2 text-right font-medium">
              {formatCurrency(invoice.baseAmount)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-2 text-right text-sm font-medium text-gray-600">
              IVA ({invoice.taxRate}%)
            </td>
            <td className="px-4 py-2 text-right font-medium">
              {formatCurrency(invoice.taxAmount)}
            </td>
          </tr>
          <tr className="bg-gray-50 border-t">
            <td className="px-4 py-3 text-right text-base font-semibold text-gray-800">
              Total
            </td>
            <td className="px-4 py-3 text-right font-bold text-blue-700">
              {formatCurrency(invoice.totalAmount)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
