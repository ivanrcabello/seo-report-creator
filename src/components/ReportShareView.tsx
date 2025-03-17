import { ClientReport } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { ShareableReportView } from "@/components/ShareableReportView";
import { 
  FileText, 
  User, 
  Calendar, 
  Globe,
  BarChart,
  Printer,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadSeoReportPdf } from "@/services/pdf/seoReportPdfOperations";
import { KeywordsAccordion } from "@/components/seo-report/KeywordsAccordion";

interface ReportShareViewProps {
  report: ClientReport;
  client?: any;
}

export const ReportShareView = ({ report, client }: ReportShareViewProps) => {
  const formattedDate = report.date 
    ? format(new Date(report.date), "d 'de' MMMM, yyyy", { locale: es }) 
    : "";
    
  const handlePrintPdf = () => {
    try {
      toast.loading("Preparando impresión...");
      
      // Use browser's print functionality
      setTimeout(() => {
        window.print();
        toast.dismiss();
        toast.success("Documento listo para imprimir o guardar como PDF");
      }, 500);
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Error al preparar el documento para impresión");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (report.id) {
        await downloadSeoReportPdf(report.id);
      } else {
        throw new Error("No report ID available");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al descargar el PDF");
    }
  };

  console.log("Report in ReportShareView:", report.id, report.title);
  console.log("Report content preview:", report.content ? report.content.substring(0, 100) + "..." : "No content");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg print:bg-blue-700 print:from-blue-700 print:to-blue-700">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {report.title || "Informe SEO"}
          </h1>
          <div className="flex gap-2 print:hidden">
            <Button 
              onClick={handlePrintPdf} 
              variant="secondary" 
              size="sm"
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button 
              onClick={handleDownloadPdf} 
              variant="secondary" 
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
        <p className="text-white/80 mt-2">
          Informe generado el {formattedDate || "N/A"}
        </p>
      </div>

      {/* Recipient Badge */}
      {client && (
        <div className="flex justify-end -mt-4 mr-4 print:mt-2 print:mr-0 print:justify-start">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md print:bg-gray-200 print:text-blue-700 print:shadow-none">
            Para: {client.name || "Cliente"}
          </div>
        </div>
      )}

      <Card className="border-0 shadow-lg mt-6 print:shadow-none print:mt-4">
        <CardContent className="p-6">
          {/* Report Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-blue-600 mb-2">Cliente</h3>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <span className="font-medium">{client?.name || "N/A"}</span>
              </div>
              {client?.company && (
                <p className="text-gray-600 ml-7">{client.company}</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-blue-600 mb-2">Detalles del informe</h3>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Fecha: {formattedDate || "N/A"}</span>
              </div>
              {report.type && (
                <div className="flex items-center gap-2 mb-1">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  <span>
                    Tipo: <Badge variant="outline">{report.type}</Badge>
                  </span>
                </div>
              )}
              {report.url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <span className="truncate">
                    <a 
                      href={report.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {report.url}
                    </a>
                  </span>
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
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Notas y observaciones</h3>
              <p className="text-gray-700 whitespace-pre-line">{report.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
