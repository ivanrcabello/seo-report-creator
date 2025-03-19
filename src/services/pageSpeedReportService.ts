
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageSpeedReport } from "./pagespeed";
import { v4 as uuidv4 } from "uuid";

/**
 * Genera un informe basado en los datos del análisis de PageSpeed y lo guarda en la base de datos
 */
export const generatePageSpeedReport = async (
  pageSpeedReport: PageSpeedReport,
  clientId: string,
  clientName: string
): Promise<boolean> => {
  try {
    console.log("Generando informe de PageSpeed para cliente:", clientId);
    
    if (!pageSpeedReport || !pageSpeedReport.metrics) {
      console.error("Error: No hay datos de PageSpeed válidos para generar el informe");
      throw new Error("No hay datos de PageSpeed válidos para generar el informe");
    }
    
    // Títulos más descriptivos
    const reportTitle = `Análisis de Rendimiento Web - ${clientName}`;
    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Crear el contenido HTML base
    const htmlContent = `
      <h1>Informe de Rendimiento Web</h1>
      <h2>Cliente: ${clientName}</h2>
      <p>Fecha: ${date}</p>
      <p>URL analizada: ${pageSpeedReport.metrics.url}</p>
      
      <h3>Puntuaciones de rendimiento</h3>
      <ul>
        <li>Rendimiento: ${Math.round(pageSpeedReport.metrics.performance_score * 100)}%</li>
        <li>Accesibilidad: ${Math.round(pageSpeedReport.metrics.accessibility_score * 100)}%</li>
        <li>Mejores prácticas: ${Math.round(pageSpeedReport.metrics.best_practices_score * 100)}%</li>
        <li>SEO: ${Math.round(pageSpeedReport.metrics.seo_score * 100)}%</li>
      </ul>
      
      <h3>Métricas principales</h3>
      <ul>
        <li>First Contentful Paint: ${pageSpeedReport.metrics.first_contentful_paint}s</li>
        <li>Speed Index: ${pageSpeedReport.metrics.speed_index}s</li>
        <li>Largest Contentful Paint: ${pageSpeedReport.metrics.largest_contentful_paint}s</li>
        <li>Time to Interactive: ${pageSpeedReport.metrics.time_to_interactive}s</li>
        <li>Total Blocking Time: ${pageSpeedReport.metrics.total_blocking_time}ms</li>
        <li>Cumulative Layout Shift: ${pageSpeedReport.metrics.cumulative_layout_shift}</li>
      </ul>
    `;
    
    // Preparar los datos del informe
    const reportData = {
      id: uuidv4(),
      client_id: clientId,
      title: reportTitle,
      content: htmlContent,
      type: 'pagespeed',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      analyticsData: {
        auditResult: {
          url: pageSpeedReport.metrics.url,
          performance: Math.round(pageSpeedReport.metrics.performance_score * 100),
          accessibility: Math.round(pageSpeedReport.metrics.accessibility_score * 100),
          bestPractices: Math.round(pageSpeedReport.metrics.best_practices_score * 100),
          seo: Math.round(pageSpeedReport.metrics.seo_score * 100),
          performanceResults: {
            pageSpeed: {
              desktop: Math.round(pageSpeedReport.metrics.performance_score * 100),
              mobile: Math.round(pageSpeedReport.metrics.performance_score * 100) - 5, // Estimación para móvil
            },
            loadTime: `${pageSpeedReport.metrics.time_to_interactive}s`,
          },
          keywordsCount: 0,
          technicalResults: {
            sslStatus: true,
            httpsRedirection: true,
            mobileOptimization: pageSpeedReport.metrics.performance_score > 0.7,
            robotsTxt: true,
            sitemap: true
          },
          socialPresence: {
            Facebook: false,
            Twitter: false,
            Instagram: false,
            LinkedIn: false
          }
        }
      }
    };
    
    console.log("Guardando informe en client_reports:", reportData);
    
    // Insertar en la tabla client_reports
    const { data, error } = await supabase
      .from('client_reports')
      .insert([reportData])
      .select();
    
    if (error) {
      console.error("Error al guardar informe de PageSpeed:", error);
      throw new Error(`Error al guardar el informe: ${error.message}`);
    }
    
    console.log("Informe guardado correctamente:", data);
    toast.success("Informe de rendimiento web generado con éxito");
    return true;
  } catch (error) {
    console.error("Error generando informe de PageSpeed:", error);
    let errorMessage = "Error al generar el informe";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
    return false;
  }
};
