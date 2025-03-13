import { AuditResult } from "./pdfAnalyzer";

export interface AIReport {
  summary: string;
  clientExplanation: string;
  technicalExplanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const generateAIReport = async (auditResult: AuditResult): Promise<AIReport> => {
  // En una implementación real, aquí se enviarían los datos del análisis a una API de IA
  // y se generaría un informe personalizado
  
  console.log("Generando informe con IA basado en los resultados del análisis");
  
  // Esperar para simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generar un resumen basado en la puntuación SEO
  const seoQuality = auditResult.seoScore < 60 ? "deficiente" : 
                     auditResult.seoScore < 70 ? "aceptable" : 
                     auditResult.seoScore < 80 ? "bueno" : "excelente";
  
  // Generar fortalezas basadas en los resultados
  const strengths = [];
  if (auditResult.technicalResults.sslStatus === 'Válido') {
    strengths.push("Certificado SSL válido");
  }
  if (auditResult.technicalResults.httpsRedirection) {
    strengths.push("Redirección HTTPS implementada");
  }
  if (auditResult.seoResults.metaTitle) {
    strengths.push("Meta títulos optimizados");
  }
  if (auditResult.seoResults.contentLength > 1000) {
    strengths.push("Contenido extenso y detallado");
  }
  if (auditResult.performanceResults.pageSpeed.desktop > 85) {
    strengths.push("Excelente velocidad en escritorio");
  }
  if (Object.values(auditResult.socialPresence).filter(Boolean).length >= 3) {
    strengths.push("Buena presencia en redes sociales");
  }
  
  // Generar debilidades basadas en los resultados
  const weaknesses = [];
  if (!auditResult.technicalResults.mobileOptimization) {
    weaknesses.push("Optimización móvil insuficiente");
  }
  if (!auditResult.technicalResults.robotsTxt) {
    weaknesses.push("Falta archivo robots.txt");
  }
  if (!auditResult.technicalResults.sitemap) {
    weaknesses.push("Falta sitemap XML");
  }
  if (!auditResult.seoResults.metaDescription) {
    weaknesses.push("Meta descripciones incompletas");
  }
  if (auditResult.seoResults.h1Tags === 0) {
    weaknesses.push("No se encuentran etiquetas H1");
  }
  if (auditResult.performanceResults.pageSpeed.mobile < 60) {
    weaknesses.push("Velocidad móvil deficiente");
  }
  if (!auditResult.performanceResults.imageOptimization) {
    weaknesses.push("Imágenes sin optimizar");
  }
  
  // Generar recomendaciones personalizadas
  const recommendations = [];
  if (!auditResult.technicalResults.mobileOptimization) {
    recommendations.push("Optimización móvil: Implementar diseño responsive y mejorar la experiencia en dispositivos móviles");
  }
  if (auditResult.performanceResults.pageSpeed.mobile < 70) {
    recommendations.push("Mejora de velocidad móvil: Comprimir imágenes, minimizar CSS/JS y habilitar caché de navegador");
  }
  if (!auditResult.technicalResults.sitemap) {
    recommendations.push("Implementación de Sitemap: Crear y enviar un sitemap XML a Google Search Console");
  }
  if (auditResult.seoResults.internalLinks < 10) {
    recommendations.push("Enlaces internos: Aumentar la estructura de enlaces internos para mejorar la navegación y distribución de autoridad");
  }
  if (!auditResult.performanceResults.imageOptimization) {
    recommendations.push("Optimización de imágenes: Comprimir y redimensionar imágenes, usar formatos modernos como WebP");
  }
  
  // Si no tenemos suficientes recomendaciones, añadir algunas generales
  if (recommendations.length < 3) {
    recommendations.push("Contenido local: Crear contenido específico para la audiencia local con keywords geográficas");
    recommendations.push("Reseñas: Implementar estrategia para conseguir más reseñas positivas en Google");
  }
  
  return {
    summary: `El análisis SEO muestra un rendimiento ${seoQuality} con una puntuación de ${auditResult.seoScore}/100. La visibilidad web es ${auditResult.webVisibility}/100 y el rendimiento general del sitio es ${auditResult.performance}/100.`,
    
    clientExplanation: `Estimado cliente,

Hemos realizado un análisis exhaustivo de su sitio web y hemos encontrado varias áreas donde podemos mejorar su visibilidad online y posicionamiento en buscadores.

Su sitio web tiene actualmente una puntuación SEO de ${auditResult.seoScore}/100, lo que indica un rendimiento ${seoQuality}. Hay varios aspectos que están funcionando bien, como ${strengths.slice(0, 2).join(", ")}, pero también identificamos áreas de mejora importantes como ${weaknesses.slice(0, 2).join(", ")}.

El análisis técnico muestra que su sitio utiliza tecnologías como ${auditResult.technicalResults.technologies.join(", ")}. La velocidad de carga en escritorio es de ${auditResult.performanceResults.pageSpeed.desktop}/100, mientras que en móvil es de ${auditResult.performanceResults.pageSpeed.mobile}/100.

Nuestro plan de acción incluirá:
- ${recommendations[0] || "Optimización de aspectos técnicos del sitio"}
- ${recommendations[1] || "Mejora del contenido y estructura SEO"}
- ${recommendations[2] || "Estrategia de posicionamiento local"}

Con estas mejoras, esperamos incrementar su visibilidad online en un 30-40% en los próximos 3 meses.`,
    
    technicalExplanation: `Análisis Técnico SEO:

Tecnologías detectadas: El sitio utiliza ${auditResult.technicalResults.technologies.join(", ")}, lo cual proporciona una base ${auditResult.technicalResults.technologies.includes("WordPress") ? "flexible pero que requiere optimización específica" : "sólida para implementar mejoras"}.

Seguridad: El sitio ${auditResult.technicalResults.sslStatus === 'Válido' ? "tiene un certificado SSL válido y" : "no tiene un certificado SSL válido, lo que"} ${auditResult.technicalResults.httpsRedirection ? "implementa" : "no implementa"} redirecciones HTTPS correctamente.

Rendimiento: El tiempo de carga es de aproximadamente ${auditResult.performanceResults.loadTime}, con una puntuación de velocidad de ${auditResult.performanceResults.pageSpeed.desktop} en escritorio y ${auditResult.performanceResults.pageSpeed.mobile} en móvil. ${auditResult.performanceResults.pageSpeed.mobile < 70 ? "La velocidad en móvil necesita optimización urgente." : "La velocidad es aceptable pero podría mejorarse."}

SEO On-Page: Las meta etiquetas están ${auditResult.seoResults.metaTitle && auditResult.seoResults.metaDescription ? "correctamente implementadas" : "parcialmente implementadas"}. La estructura de encabezados ${auditResult.seoResults.h1Tags > 0 ? "es adecuada" : "necesita revisión"}. El contenido tiene aproximadamente ${auditResult.seoResults.contentLength} palabras, lo cual es ${auditResult.seoResults.contentLength > 1000 ? "positivo" : "insuficiente"} para un buen posicionamiento.

Arquitectura Web: El sitio tiene ${auditResult.seoResults.internalLinks} enlaces internos y ${auditResult.seoResults.externalLinks} externos. ${auditResult.seoResults.canonicalTag ? "Las etiquetas canónicas están correctamente implementadas." : "Faltan etiquetas canónicas en algunas páginas."}

Presencia Social: La marca tiene presencia en ${Object.values(auditResult.socialPresence).filter(Boolean).length} plataformas sociales, incluyendo ${Object.entries(auditResult.socialPresence).filter(([_, value]) => value).map(([key]) => key).join(", ")}.`,
    
    strengths: strengths.length > 0 ? strengths : ["Certificado SSL implementado", "Estructura básica SEO presente"],
    
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Optimización SEO incompleta", "Rendimiento móvil deficiente"],
    
    recommendations: recommendations.length > 0 ? recommendations : [
      "Optimización técnica: Mejorar aspectos técnicos como la velocidad de carga y la estructura de la web",
      "Contenido SEO: Desarrollar contenido optimizado para palabras clave relevantes",
      "Estrategia local: Implementar una estrategia de SEO local completa"
    ]
  };
};
