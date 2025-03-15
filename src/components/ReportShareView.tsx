
import { ClientReport } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { ShareableReportView } from "@/components/ShareableReportView";
import { 
  FileText, 
  User, 
  Calendar, 
  Link,
  Globe
} from "lucide-react";

interface ReportShareViewProps {
  report: ClientReport;
  client?: any;
}

export const ReportShareView = ({ report, client }: ReportShareViewProps) => {
  const formattedDate = report.date 
    ? format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es }) 
    : "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-seo-blue to-seo-purple text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          {report.title || "Informe SEO"}
        </h1>
        <p className="text-center text-white/80 mt-2">
          Informe generado el {formattedDate || "N/A"}
        </p>
      </div>

      {/* Recipient Badge */}
      {client && (
        <div className="flex justify-end -mt-4 mr-4">
          <div className="bg-seo-blue text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
            Para: {client.name || "Cliente"}
          </div>
        </div>
      )}

      <Card className="border-0 shadow-lg mt-6">
        <CardContent className="p-6">
          {/* Report Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-seo-blue mb-2">Cliente</h3>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-seo-purple" />
                <span className="font-medium">{client?.name || "N/A"}</span>
              </div>
              {client?.company && (
                <p className="text-gray-600 ml-7">{client.company}</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-seo-blue mb-2">Detalles del informe</h3>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-5 w-5 text-seo-purple" />
                <span>Fecha: {formattedDate || "N/A"}</span>
              </div>
              {report.type && (
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5 text-seo-purple" />
                  <span>Tipo: {report.type}</span>
                </div>
              )}
              {report.url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-seo-purple" />
                  <span className="truncate">{report.url}</span>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Report Content */}
          <div>
            <ShareableReportView report={report} />
          </div>

          {/* Notes */}
          {report.notes && (
            <div className="mt-8 p-6 bg-gradient-to-r from-seo-blue/5 to-seo-purple/5 rounded-lg border border-seo-purple/10">
              <h3 className="text-lg font-semibold text-seo-blue mb-3">Notas y observaciones</h3>
              <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
