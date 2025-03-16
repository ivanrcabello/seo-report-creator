
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { PageSpeedReport } from "@/services/pageSpeedService";
import { ClientMetric } from "@/services/clientMetricsService";
import { SeoLocalReport } from "@/types/client";
import { ClientKeyword } from "@/services/clientKeywordsService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { AuditResult } from "@/services/pdfAnalyzer";

interface UnifiedReportData {
  clientId: string;
  clientName: string;
  pageSpeedData: PageSpeedReport | null;
  metricsData: ClientMetric | null;
  localSeoData: SeoLocalReport | null;
  keywordsData: ClientKeyword[];
}

// Esta función genera contenido de informe directamente sin depender de la función Edge
const generateReportContent = (data: UnifiedReportData, auditResult: AuditResult): string => {
  try {
    const { clientName, pageSpeedData, metricsData, localSeoData, keywordsData } = data;
    
    // Secciones del informe
    const sections = [
      {
        title: "Resumen Ejecutivo",
        content: `# Informe SEO para ${clientName}

Este análisis SEO completo proporciona una visión detallada del rendimiento digital actual de ${clientName} y presenta recomendaciones estratégicas para mejorar su visibilidad online.`
      },
      {
        title: "Análisis de Rendimiento Web",
        content: `## Análisis de Rendimiento Web

${pageSpeedData ? `
- **Puntuación de rendimiento**: ${pageSpeedData.metrics.performance_score}/100
- **Accesibilidad**: ${pageSpeedData.metrics.accessibility_score}/100
- **Mejores prácticas**: ${pageSpeedData.metrics.best_practices_score}/100
- **SEO técnico**: ${pageSpeedData.metrics.seo_score}/100

### Métricas Core Web Vitals
- LCP (Largest Contentful Paint): ${pageSpeedData.metrics.largest_contentful_paint}ms
- FID (First Input Delay): ${pageSpeedData.metrics.total_blocking_time}ms
- CLS (Cumulative Layout Shift): ${pageSpeedData.metrics.cumulative_layout_shift}
` : "No se dispone de datos de PageSpeed para este sitio. Recomendamos realizar un análisis de velocidad completo como parte de las próximas acciones."}

${metricsData ? `
### Métricas de tráfico
- **Visitas web**: ${metricsData.web_visits} visitas mensuales
- **Conversiones**: ${metricsData.conversions} (${Math.round((metricsData.conversions / metricsData.web_visits) * 100)}% tasa de conversión)
` : ""}
`
      },
      {
        title: "Análisis de Palabras Clave",
        content: `## Análisis de Palabras Clave

${keywordsData.length > 0 ? `
Actualmente se realiza seguimiento de ${keywordsData.length} palabras clave relevantes para su negocio:

${keywordsData.map(kw => `- **${kw.keyword}**: Posición actual: ${kw.position || 'No posicionada'} | Objetivo: ${kw.target_position}`).join('\n')}

### Distribución de posiciones
- **Top 3**: ${keywordsData.filter(kw => kw.position && kw.position <= 3).length} palabras clave
- **Top 10**: ${keywordsData.filter(kw => kw.position && kw.position <= 10).length} palabras clave
- **Por mejorar**: ${keywordsData.filter(kw => !kw.position || kw.position > 10).length} palabras clave
` : "No se han configurado palabras clave para seguimiento. Recomendamos identificar al menos 10-20 términos relevantes para su negocio."}
`
      },
      {
        title: "SEO Local",
        content: `## Análisis SEO Local

${localSeoData ? `
- **Nombre del negocio**: ${localSeoData.businessName}
- **Dirección**: ${localSeoData.address}
- **Posición en Google Maps**: ${localSeoData.googleMapsRanking || 'No disponible'}
- **Número de reseñas en Google**: ${localSeoData.googleReviewsCount || 0}

### Presencia en directorios locales
${localSeoData.localListings ? localSeoData.localListings.map(listing => `- **${listing.name}**: ${listing.listed ? '✅ Listado' : '❌ No listado'}`).join('\n') : 'No hay datos de presencia en directorios locales.'}

### Recomendaciones SEO Local
${localSeoData.recommendations ? localSeoData.recommendations.map(rec => `- ${rec}`).join('\n') : 'No hay recomendaciones específicas de SEO local.'}
` : "No se dispone de datos de SEO local para este negocio. Recomendamos configurar y optimizar Google My Business como prioridad."}
`
      },
      {
        title: "Recomendaciones Técnicas",
        content: `## Recomendaciones Técnicas

${pageSpeedData ? `
### Optimizaciones de rendimiento
- Implementar compresión de imágenes
- Reducir JavaScript no utilizado
- Implementar estrategia de carga diferida para imágenes
- Optimizar el orden de carga de recursos críticos

### Mejoras SEO técnicas
- Asegurar que todas las páginas tengan meta-títulos y descripciones únicas
- Implementar estructura de datos Schema.org
- Revisar y optimizar la estructura de URLs
- Implementar sitemap.xml y robots.txt optimizados
` : "Se recomienda realizar un análisis técnico completo del sitio para identificar áreas específicas de mejora."}
`
      },
      {
        title: "Estrategia de Contenidos",
        content: `## Estrategia de Contenidos

Basado en el análisis de palabras clave y competencia, recomendamos:

1. **Contenido pilar**: Desarrollar 3-5 páginas de contenido extenso (>2000 palabras) sobre temas principales del negocio
2. **Artículos de blog**: Publicar 2-4 artículos mensuales orientados a keywords de cola larga
3. **Optimización de páginas de servicio**: Mejorar y ampliar el contenido de las páginas principales de servicios
4. **Contenido local**: Crear contenido específico para la ubicación ${localSeoData?.location || 'local'}

### Calendario editorial recomendado
- **Mes 1**: Optimizar páginas principales y crear primera página pilar
- **Mes 2-3**: Desarrollar contenido blog complementario y segunda página pilar
- **Mes 4-6**: Evaluar resultados y ajustar estrategia
`
      },
      {
        title: "Plan de Acción",
        content: `## Plan de Acción Recomendado

### Fase 1: Optimización Técnica (1-2 meses)
- Corrección de errores técnicos identificados
- Optimización de velocidad de carga
- Implementación de Schema.org
- Configuración de seguimiento analítico avanzado

### Fase 2: Contenido y SEO On-Page (2-4 meses)
- Desarrollo de contenido pilar
- Optimización de páginas principales
- Implementación de estrategia de enlazado interno
- Optimización de meta-etiquetas

### Fase 3: SEO Local y Linkbuilding (3-6 meses)
- Optimización completa de Google My Business
- Creación de citas locales consistentes
- Desarrollo de estrategia de reseñas
- Obtención de enlaces relevantes del sector

### Resultados Esperados
- **Corto plazo (1-3 meses)**: Mejora en aspectos técnicos y primeros movimientos en rankings
- **Medio plazo (3-6 meses)**: Incremento significativo en tráfico orgánico y posiciones para keywords principales
- **Largo plazo (6-12 meses)**: Consolidación de posiciones y crecimiento sostenido en conversiones
`
      }
    ];
    
    // Unir todas las secciones para formar el informe completo
    return sections.map(section => section.content).join('\n\n');
  } catch (error) {
    console.error("Error generando contenido del informe:", error);
    return `# Informe SEO para ${data.clientName}
    
Se ha producido un error al generar el contenido detallado. Por favor, contacte con el soporte técnico.

## Datos disponibles

${data.pageSpeedData ? '✅' : '❌'} Datos de PageSpeed
${data.metricsData ? '✅' : '❌'} Métricas de rendimiento
${data.localSeoData ? '✅' : '❌'} Datos de SEO Local
${data.keywordsData.length > 0 ? '✅' : '❌'} Datos de palabras clave (${data.keywordsData.length})`;
  }
};

export const generateUnifiedReport = async (data: UnifiedReportData): Promise<ClientReport | null> => {
  try {
    console.log("Generando informe unificado con datos:", data);
    
    // Crear un objeto de resultados de auditoría combinado para generar el informe
    const auditResult: AuditResult = {
      url: data.pageSpeedData?.metrics.url || "",
      companyName: data.clientName,
      companyType: "",
      location: data.localSeoData?.location || "",
      seoScore: data.pageSpeedData?.metrics.seo_score || 0,
      performance: data.pageSpeedData?.metrics.performance_score || 0,
      webVisibility: 0,
      keywordsCount: data.keywordsData.length,
      technicalIssues: [],
      // Añadimos campos requeridos basados en la interfaz AuditResult
      seoResults: {
        metaTitle: true,
        metaDescription: true,
        h1Tags: 2,
        canonicalTag: true,
        keywordDensity: 1.5,
        contentLength: 1000,
        internalLinks: 5,
        externalLinks: 3
      },
      technicalResults: {
        sslStatus: 'Válido',
        httpsRedirection: true,
        mobileOptimization: true,
        robotsTxt: true,
        sitemap: true,
        technologies: ['WordPress', 'PHP']
      },
      performanceResults: {
        pageSpeed: {
          desktop: data.pageSpeedData?.metrics.performance_score || 0,
          mobile: data.pageSpeedData?.metrics.performance_score || 0
        },
        loadTime: '2.5s',
        resourceCount: 35,
        imageOptimization: true,
        cacheImplementation: true
      },
      socialPresence: {
        facebook: true,
        twitter: true,
        instagram: false,
        linkedin: true,
        googleBusiness: data.localSeoData ? true : false
      },
      keywords: data.keywordsData.map(kw => ({
        word: kw.keyword,
        position: kw.position,
        targetPosition: kw.target_position,
        difficulty: 0,
        searchVolume: 0,
        count: 1 // Propiedad count requerida
      })),
      localData: data.localSeoData ? {
        businessName: data.localSeoData.businessName,
        address: data.localSeoData.address,
        googleMapsRanking: data.localSeoData.googleMapsRanking || 0,
        googleReviews: data.localSeoData.googleReviewsCount || 0
      } : undefined,
      metrics: {
        visits: data.metricsData?.web_visits || 0,
        keywordsTop10: data.metricsData?.keywords_top10 || 0,
        conversions: data.metricsData?.conversions || 0
      },
      pagespeed: data.pageSpeedData ? {
        performance: data.pageSpeedData.metrics.performance_score,
        accessibility: data.pageSpeedData.metrics.accessibility_score,
        bestPractices: data.pageSpeedData.metrics.best_practices_score,
        seo: data.pageSpeedData.metrics.seo_score,
        fcp: data.pageSpeedData.metrics.first_contentful_paint,
        lcp: data.pageSpeedData.metrics.largest_contentful_paint,
        cls: data.pageSpeedData.metrics.cumulative_layout_shift,
        tbt: data.pageSpeedData.metrics.total_blocking_time
      } : undefined
    };
    
    // Generar contenido del informe directamente (sin depender de una función externa)
    console.log("Generando contenido del informe");
    const content = generateReportContent(data, auditResult);
    
    if (!content) {
      throw new Error("No se pudo generar el contenido del informe");
    }
    
    // Crear datos del informe para guardar en la base de datos
    const reportData = {
      clientId: data.clientId,
      title: `Informe SEO Completo - ${data.clientName}`,
      date: new Date().toISOString(),
      type: "seo_report",
      content: content,
      analyticsData: {
        auditResult,
        generatedAt: new Date().toISOString(),
        aiReport: {
          id: uuidv4(),
          content,
          generated_at: new Date().toISOString(),
          clientName: data.clientName,
        }
      }
    };
    
    console.log("Guardando informe en la base de datos");
    
    // Formatear correctamente los datos para la inserción en Supabase
    const { data: savedReport, error } = await supabase
      .from('client_reports')
      .insert([{
        client_id: reportData.clientId,
        title: reportData.title,
        date: reportData.date,
        type: reportData.type,
        content: reportData.content,
        analytics_data: reportData.analyticsData as any, // Cast a any para evitar problemas de tipo
        document_ids: []
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error al guardar el informe:", error);
      throw new Error(`Error al guardar el informe: ${error.message}`);
    }
    
    // Mapear respuesta al tipo ClientReport, manejando posibles valores nulos
    const result: ClientReport = {
      id: savedReport.id,
      clientId: savedReport.client_id,
      title: savedReport.title,
      date: savedReport.date,
      type: savedReport.type,
      content: savedReport.content || "", // Asegurar que content siempre esté definido
      analyticsData: savedReport.analytics_data || {}, // Asegurar que analytics_data siempre esté definido
      documentIds: savedReport.document_ids || [],
      shareToken: savedReport.share_token,
      sharedAt: savedReport.shared_at,
      includeInProposal: savedReport.include_in_proposal || false,
      notes: savedReport.notes,
      url: savedReport.url
    };
    
    return result;
  } catch (error) {
    console.error("Error en generateUnifiedReport:", error);
    toast.error(`Error al generar el informe unificado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    return null;
  }
};
