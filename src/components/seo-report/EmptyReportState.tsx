
import { ClientReport } from "@/types/client";
import { AlertCircle } from "lucide-react";

interface EmptyReportStateProps {
  report: ClientReport;
}

export const EmptyReportState = ({ report }: EmptyReportStateProps) => {
  return (
    <div className="p-10 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Este informe no contiene datos de análisis</h3>
      <p className="text-gray-500 mb-6">El informe fue creado pero no contiene datos de análisis SEO.</p>
      
      {report.notes && (
        <div className="text-left bg-white p-6 rounded-lg border border-gray-200 mt-4">
          <h4 className="font-medium mb-2">Notas:</h4>
          <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
        </div>
      )}
    </div>
  );
};
