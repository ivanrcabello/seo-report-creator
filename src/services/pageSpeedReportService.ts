import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { addReport } from "@/services/reportService";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { PageSpeedReport, PageSpeedMetrics, PageSpeedAudit } from "@/services/pagespeed/types";

// Function to generate a professional report with visual indicators
export const generatePageSpeedReport = async (
  report: PageSpeedReport,
  clientId: string,
  clientName: string
): Promise<ClientReport> => {
  try {
    // Create report content with proper formatting and visual indicators
    const content = generateFormattedReportContent(report, clientName);
    
    // Create a new report object
    const newReport: Omit<ClientReport, "id"> = {
      clientId,
      title: `Informe PageSpeed - ${new Date().toLocaleDateString('es-ES')}`,
      date: new Date().toISOString(),
      type: "pagespeed",
      url: report.metrics.url || "",
      content,
      documentIds: [],
      shareToken: uuidv4(),
      sharedAt: null,
      includeInProposal: false,
      analyticsData: {}, // Add empty object to satisfy the type requirement
      auditResult: {
        url: report.metrics.url || "",
        seoScore: report.metrics.seo_score,
        performance: report.metrics.performance_score,
        accessibility: report.metrics.accessibility_score,
        bestPractices: report.metrics.best_practices_score,
        seoData: [],
        performanceData: [],
        socialData: [],
        technicalData: []
      }
    };
    
    // Save report to database
    return await addReport(newReport);
  } catch (error) {
    console.error("Error generating PageSpeed report:", error);
    throw new Error("No se pudo generar el informe de PageSpeed");
  }
};

// Helper function to format score as emojis/visual indicators
const getScoreIndicator = (score: number): string => {
  if (score >= 90) return "🟢"; // Green circle for good
  if (score >= 50) return "🟠"; // Orange circle for needs improvement
  return "🔴"; // Red circle for poor
};

// Helper function to format performance metrics
const formatTime = (ms: number): string => {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
};

// Generate a professional, formatted report content with visual indicators
const generateFormattedReportContent = (report: PageSpeedReport, clientName: string): string => {
  const { metrics, audits } = report;
  
  // Get failing audits (scores below 0.5)
  const failingAudits = audits
    .filter(audit => audit.score < 0.5)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  
  // Get opportunities (scores between 0.5 and 0.9)
  const opportunities = audits
    .filter(audit => audit.score >= 0.5 && audit.score < 0.9)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  
  // Get passing audits (scores above 0.9)
  const passingAudits = audits
    .filter(audit => audit.score >= 0.9)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  // Performance metrics evaluation
  const lcpStatus = metrics.largest_contentful_paint <= 2500 ? "Bueno" : 
                    metrics.largest_contentful_paint <= 4000 ? "Necesita mejoras" : "Pobre";
  
  const tbtStatus = metrics.total_blocking_time <= 200 ? "Bueno" : 
                    metrics.total_blocking_time <= 600 ? "Necesita mejoras" : "Pobre";
  
  const clsStatus = metrics.cumulative_layout_shift <= 0.1 ? "Bueno" : 
                    metrics.cumulative_layout_shift <= 0.25 ? "Necesita mejoras" : "Pobre";
  
  // Recommendations based on audit results
  const recommendations = generateRecommendations(report);
  
  // Format current date as the analysis date
  const analysisDate = new Date().toLocaleDateString('es-ES');
  
  // Convert decimal scores (0-1) to percentages (0-100) for display
  const performanceScore = Math.round(metrics.performance_score * 100);
  const accessibilityScore = Math.round(metrics.accessibility_score * 100);
  const bestPracticesScore = Math.round(metrics.best_practices_score * 100);
  const seoScore = Math.round(metrics.seo_score * 100);
  
  return `# Informe de Rendimiento Web para ${clientName}

## Resumen Ejecutivo

Análisis realizado en: **${metrics.url || "URL no especificada"}**  
Fecha: **${analysisDate}**

### Puntuaciones Generales

| Categoría | Puntuación | Evaluación |
|-----------|------------|------------|
| Rendimiento | ${performanceScore}/100 | ${getScoreIndicator(performanceScore)} |
| Accesibilidad | ${accessibilityScore}/100 | ${getScoreIndicator(accessibilityScore)} |
| Mejores Prácticas | ${bestPracticesScore}/100 | ${getScoreIndicator(bestPracticesScore)} |
| SEO | ${seoScore}/100 | ${getScoreIndicator(seoScore)} |

## Métricas Principales de Core Web Vitals

| Métrica | Valor | Estado | Impacto SEO |
|---------|-------|--------|-------------|
| Largest Contentful Paint (LCP) | ${formatTime(metrics.largest_contentful_paint)} | ${lcpStatus} ${getScoreIndicator(metrics.largest_contentful_paint <= 2500 ? 90 : metrics.largest_contentful_paint <= 4000 ? 60 : 30)} | Alto |
| Total Blocking Time (TBT) | ${formatTime(metrics.total_blocking_time)} | ${tbtStatus} ${getScoreIndicator(metrics.total_blocking_time <= 200 ? 90 : metrics.total_blocking_time <= 600 ? 60 : 30)} | Medio |
| Cumulative Layout Shift (CLS) | ${metrics.cumulative_layout_shift.toFixed(3)} | ${clsStatus} ${getScoreIndicator(metrics.cumulative_layout_shift <= 0.1 ? 90 : metrics.cumulative_layout_shift <= 0.25 ? 60 : 30)} | Medio |
| First Contentful Paint (FCP) | ${formatTime(metrics.first_contentful_paint)} | - | - |
| Time to Interactive (TTI) | ${formatTime(metrics.time_to_interactive)} | - | - |

## Problemas Críticos a Resolver

${failingAudits.map(audit => `### ${audit.title}\n**Puntuación:** ${Math.round(audit.score * 100)}/100 ${getScoreIndicator(audit.score * 100)}\n\n${audit.description}\n\n${audit.displayValue ? `**Valor actual:** ${audit.displayValue}` : ''}`).join('\n\n')}

## Oportunidades de Mejora

${opportunities.map(audit => `### ${audit.title}\n**Puntuación:** ${Math.round(audit.score * 100)}/100 ${getScoreIndicator(audit.score * 100)}\n\n${audit.description}\n\n${audit.displayValue ? `**Valor actual:** ${audit.displayValue}` : ''}`).join('\n\n')}

## Puntos Fuertes

${passingAudits.map(audit => `### ${audit.title}\n**Puntuación:** ${Math.round(audit.score * 100)}/100 ${getScoreIndicator(audit.score * 100)}\n\n${audit.description}`).join('\n\n')}

## Plan de Acción Recomendado

### Prioridad Alta (Resolver en 30 días)
${recommendations.high.map(rec => `- ${rec}`).join('\n')}

### Prioridad Media (Resolver en 60 días)
${recommendations.medium.map(rec => `- ${rec}`).join('\n')}

### Prioridad Baja (Resolver en 90 días)
${recommendations.low.map(rec => `- ${rec}`).join('\n')}

## Impacto Esperado en SEO

La mejora de los Core Web Vitals de la página tiene un impacto directo en el posicionamiento SEO, especialmente en búsquedas móviles. Google ha confirmado que estas métricas son factores de ranking directo.

Con las mejoras propuestas, esperamos:
- Mejora del posicionamiento para palabras clave competitivas
- Aumento del CTR en resultados de búsqueda
- Reducción de la tasa de rebote y mejora de la experiencia de usuario
- Mayor tiempo de permanencia en la página

## Próximos Pasos

1. Implementar las soluciones de prioridad alta
2. Realizar un nuevo análisis de la página tras los cambios
3. Supervisar las métricas en Google Search Console
4. Avanzar con las soluciones de prioridad media y baja

---

*Este informe ha sido generado automáticamente basado en datos de PageSpeed Insights.*
*Fecha de generación: ${new Date().toLocaleDateString('es-ES')}*`;
};

// Generate prioritized recommendations based on audit results
const generateRecommendations = (report: PageSpeedReport): {
  high: string[];
  medium: string[];
  low: string[];
} => {
  const { audits } = report;
  
  // High priority: failing audits (score < 0.5)
  const highPriority = audits
    .filter(audit => audit.score < 0.5)
    .map(audit => getRecommendation(audit.id, audit.title));
  
  // Medium priority: needs improvement (0.5 <= score < 0.8)
  const mediumPriority = audits
    .filter(audit => audit.score >= 0.5 && audit.score < 0.8)
    .map(audit => getRecommendation(audit.id, audit.title));
  
  // Low priority: good but could be better (0.8 <= score < 0.95)
  const lowPriority = audits
    .filter(audit => audit.score >= 0.8 && audit.score < 0.95)
    .map(audit => getRecommendation(audit.id, audit.title));
  
  return {
    high: highPriority.slice(0, 5),
    medium: mediumPriority.slice(0, 5),
    low: lowPriority.slice(0, 3)
  };
};

// Get specific recommendation based on audit ID
const getRecommendation = (auditId: string, title: string): string => {
  const recommendations: Record<string, string> = {
    'render-blocking-resources': `Eliminar o diferir los recursos que bloquean el renderizado (${title})`,
    'uses-optimized-images': `Optimizar las imágenes para reducir su tamaño manteniendo la calidad visual (${title})`,
    'uses-webp-images': `Convertir imágenes a formatos modernos como WebP para mejor compresión (${title})`,
    'uses-text-compression': `Habilitar la compresión GZIP o Brotli para reducir el tamaño de transferencia (${title})`,
    'uses-responsive-images': `Implementar imágenes responsivas para diferentes tamaños de pantalla (${title})`,
    'time-to-first-byte': `Reducir el tiempo de respuesta del servidor optimizando la infraestructura backend (${title})`,
    'first-contentful-paint': `Reducir el tiempo del First Contentful Paint optimizando la carga inicial (${title})`,
    'largest-contentful-paint': `Priorizar la carga del contenido principal visible para mejorar el LCP (${title})`,
    'total-blocking-time': `Reducir el tiempo que la interfaz principal está bloqueada para interacciones (${title})`,
    'cumulative-layout-shift': `Prevenir cambios visuales inesperados durante la carga (${title})`,
    'color-contrast': `Mejorar el contraste de color para una mejor legibilidad (${title})`,
    'document-title': `Asegurar que el documento tiene un título descriptivo y único (${title})`,
    'html-has-lang': `Añadir un atributo lang al elemento HTML para especificar el idioma (${title})`,
    'image-alt': `Añadir texto alternativo a todas las imágenes para accesibilidad (${title})`,
    'meta-viewport': `Configurar correctamente la etiqueta viewport para dispositivos móviles (${title})`,
    'viewport': `Asegurar que la página tiene una etiqueta viewport configurada correctamente (${title})`,
    'meta-description': `Añadir una meta descripción única y descriptiva (${title})`,
    'link-text': `Usar texto de enlace descriptivo en lugar de textos genéricos (${title})`,
    'robots-txt': `Verificar y optimizar el archivo robots.txt (${title})`,
    'canonical': `Implementar etiquetas canónicas para evitar contenido duplicado (${title})`,
  };
  
  return recommendations[auditId] || `Optimizar: ${title}`;
};
