
import { DocumentTemplate } from "@/types/templates";
import { Card } from "@/components/ui/card";

interface TemplatePreviewProps {
  template: DocumentTemplate;
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  // Variables de ejemplo para la previsualización
  const previewData = {
    companyName: "Nombre de la Empresa",
    companyLogo: "/placeholder.svg",
    reportTitle: "Título del Informe",
    clientName: "Nombre del Cliente",
    reportDate: new Date().toLocaleDateString(),
    currentPage: 1,
    totalPages: 5
  };

  // Reemplazar variables en el HTML
  const replaceVariables = (html: string) => {
    return html
      .replace(/{{companyName}}/g, previewData.companyName)
      .replace(/{{companyLogo}}/g, previewData.companyLogo)
      .replace(/{{reportTitle}}/g, previewData.reportTitle)
      .replace(/{{clientName}}/g, previewData.clientName)
      .replace(/{{reportDate}}/g, previewData.reportDate)
      .replace(/{{currentPage}}/g, previewData.currentPage.toString())
      .replace(/{{totalPages}}/g, previewData.totalPages.toString());
  };

  return (
    <div className="p-8 space-y-8">
      <style>{template.css}</style>
      
      {/* Portada */}
      {template.coverPageHtml && (
        <Card className="p-8 mb-8">
          <div dangerouslySetInnerHTML={{ __html: replaceVariables(template.coverPageHtml) }} />
        </Card>
      )}
      
      {/* Contenido */}
      <Card className="relative p-8">
        {/* Encabezado */}
        {template.headerHtml && (
          <div className="absolute top-4 left-4 right-4">
            <div dangerouslySetInnerHTML={{ __html: replaceVariables(template.headerHtml) }} />
          </div>
        )}
        
        {/* Secciones */}
        <div className="mt-16 mb-16">
          {template.sections
            ?.filter(section => section.isEnabled)
            .sort((a, b) => a.order - b.order)
            .map(section => (
              <div key={section.id} className="mb-8">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))
          }
        </div>
        
        {/* Pie de página */}
        {template.footerHtml && (
          <div className="absolute bottom-4 left-4 right-4">
            <div dangerouslySetInnerHTML={{ __html: replaceVariables(template.footerHtml) }} />
          </div>
        )}
      </Card>
    </div>
  );
};
