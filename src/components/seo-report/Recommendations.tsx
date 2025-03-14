
import { AuditResult } from "@/services/pdfAnalyzer";

interface RecommendationsProps {
  auditResult: AuditResult;
}

export const Recommendations = ({ auditResult }: RecommendationsProps) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Recomendaciones de mejora</h3>
      <ul className="space-y-3 list-disc pl-5">
        <li>
          {auditResult.seoResults.metaTitle ? 
            "Mantener la correcta implementación de meta títulos." : 
            "Implementar meta títulos optimizados con palabras clave relevantes."}
        </li>
        <li>
          {auditResult.seoResults.metaDescription ? 
            "Las meta descripciones están correctamente implementadas." : 
            "Añadir meta descripciones atractivas que incluyan palabras clave."}
        </li>
        <li>
          {auditResult.performanceResults.pageSpeed.mobile >= 70 ? 
            "La velocidad en dispositivos móviles es adecuada." : 
            "Mejorar la velocidad de carga en dispositivos móviles."}
        </li>
        <li>
          {auditResult.technicalResults.mobileOptimization ? 
            "La web está correctamente optimizada para móviles." : 
            "Optimizar el sitio web para dispositivos móviles."}
        </li>
        <li>
          {auditResult.technicalResults.robotsTxt && auditResult.technicalResults.sitemap ? 
            "Mantener actualizado el archivo robots.txt y sitemap." : 
            "Implementar o corregir el archivo robots.txt y/o sitemap."}
        </li>
        <li>
          {auditResult.seoResults.h1Tags > 0 ? 
            "Las etiquetas H1 están correctamente implementadas." : 
            "Añadir etiquetas H1 que incluyan palabras clave relevantes."}
        </li>
        <li>
          {auditResult.seoResults.keywordDensity >= 1 ? 
            "Mantener una densidad de palabras clave óptima." : 
            "Aumentar la densidad de palabras clave en el contenido."}
        </li>
      </ul>
    </div>
  );
};
