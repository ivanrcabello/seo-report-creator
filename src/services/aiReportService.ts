
import { AuditResult } from "./pdfAnalyzer";
import { toast } from "sonner";

// Esta interfaz define la estructura del informe generado por IA
export interface AIReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  technicalExplanation: string;
  clientExplanation: string;
}

// Función que simula la generación de un informe usando IA
// En una implementación real, aquí se conectaría con una API de IA como OpenAI
export const generateAIReport = async (auditResult: AuditResult): Promise<AIReport> => {
  console.log("Generando informe con IA basado en:", auditResult);
  
  // Simulamos tiempo de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generamos un informe basado en los resultados
  const report: AIReport = {
    summary: generateSummary(auditResult),
    strengths: generateStrengths(auditResult),
    weaknesses: generateWeaknesses(auditResult),
    recommendations: generateRecommendations(auditResult),
    technicalExplanation: generateTechnicalExplanation(auditResult),
    clientExplanation: generateClientExplanation(auditResult),
  };

  return report;
};

// Función para generar un resumen basado en los resultados
const generateSummary = (auditResult: AuditResult): string => {
  const overallScore = auditResult.seoScore;
  if (overallScore >= 80) {
    return `El sitio web analizado muestra un rendimiento SEO sólido con una puntuación de ${overallScore}%. La estructura técnica es generalmente correcta, aunque existen oportunidades de mejora específicas que podrían aumentar aún más la visibilidad y el rendimiento.`;
  } else if (overallScore >= 60) {
    return `El análisis revela un rendimiento SEO moderado con una puntuación de ${overallScore}%. Se han identificado varias áreas que requieren atención para mejorar la visibilidad en los motores de búsqueda y optimizar la experiencia del usuario.`;
  } else {
    return `Los resultados del análisis indican importantes desafíos SEO con una puntuación de ${overallScore}%. Se requieren intervenciones inmediatas en múltiples áreas para establecer una presencia efectiva en los motores de búsqueda y mejorar el rendimiento general del sitio.`;
  }
};

// Función para identificar las fortalezas del sitio
const generateStrengths = (auditResult: AuditResult): string[] => {
  const strengths: string[] = [];

  if (auditResult.technicalResults.sslStatus === 'Válido') {
    strengths.push("Certificado SSL implementado correctamente, lo que proporciona una conexión segura para los usuarios y es favorable para el SEO.");
  }

  if (auditResult.technicalResults.httpsRedirection) {
    strengths.push("Redirección HTTPS configurada adecuadamente, asegurando que todo el tráfico se dirija a la versión segura del sitio.");
  }

  if (auditResult.seoResults.metaTitle) {
    strengths.push("Meta títulos implementados correctamente, lo que mejora la relevancia en los resultados de búsqueda.");
  }

  if (auditResult.seoResults.contentLength > 1000) {
    strengths.push(`Contenido sustancial con ${auditResult.seoResults.contentLength} palabras, lo que favorece el posicionamiento para términos relevantes.`);
  }

  if (auditResult.performanceResults.pageSpeed.desktop > 80) {
    strengths.push(`Excelente velocidad de carga en escritorio (${auditResult.performanceResults.pageSpeed.desktop}%), lo que mejora la experiencia de usuario y el SEO.`);
  }

  if (auditResult.seoResults.internalLinks > 10) {
    strengths.push(`Buena estructura de enlaces internos con ${auditResult.seoResults.internalLinks} enlaces, lo que facilita la navegación y el rastreo por parte de los buscadores.`);
  }

  // Si no se encontraron fortalezas específicas
  if (strengths.length === 0) {
    strengths.push("El sitio cuenta con potencial para mejorar en varios aspectos SEO fundamentales.");
  }

  return strengths;
};

// Función para identificar las debilidades del sitio
const generateWeaknesses = (auditResult: AuditResult): string[] => {
  const weaknesses: string[] = [];

  if (!auditResult.seoResults.metaDescription) {
    weaknesses.push("Falta de meta descripciones optimizadas, lo que reduce la efectividad en los resultados de búsqueda.");
  }

  if (auditResult.seoResults.h1Tags === 0) {
    weaknesses.push("Ausencia de etiquetas H1, fundamentales para indicar el tema principal de cada página.");
  }

  if (auditResult.performanceResults.pageSpeed.mobile < 70) {
    weaknesses.push(`Velocidad de carga en dispositivos móviles insuficiente (${auditResult.performanceResults.pageSpeed.mobile}%), lo que afecta negativamente a la experiencia de usuario y al SEO móvil.`);
  }

  if (!auditResult.technicalResults.mobileOptimization) {
    weaknesses.push("El sitio no está optimizado para dispositivos móviles, lo que perjudica significativamente el SEO en la era móvil.");
  }

  if (!auditResult.technicalResults.robotsTxt || !auditResult.technicalResults.sitemap) {
    weaknesses.push("Configuración técnica incompleta: falta el archivo robots.txt y/o el sitemap, herramientas esenciales para guiar a los buscadores.");
  }

  if (auditResult.seoResults.keywordDensity < 1) {
    weaknesses.push(`Baja densidad de palabras clave (${auditResult.seoResults.keywordDensity}%), lo que puede dificultar que los buscadores identifiquen la temática del sitio.`);
  }

  // Si no se encontraron debilidades específicas
  if (weaknesses.length === 0) {
    weaknesses.push("No se detectaron debilidades críticas, aunque siempre hay margen para optimizaciones específicas.");
  }

  return weaknesses;
};

// Función para generar recomendaciones específicas
const generateRecommendations = (auditResult: AuditResult): string[] => {
  const recommendations: string[] = [];

  if (!auditResult.seoResults.metaDescription) {
    recommendations.push("Implementar meta descripciones únicas y persuasivas para cada página, incluyendo palabras clave relevantes y llamadas a la acción.");
  }

  if (auditResult.seoResults.h1Tags === 0) {
    recommendations.push("Añadir una etiqueta H1 por página que incluya la palabra clave principal y refleje el contenido de la página.");
  }

  if (auditResult.performanceResults.pageSpeed.mobile < 70) {
    recommendations.push("Optimizar la velocidad de carga móvil mediante compresión de imágenes, minificación de CSS/JavaScript y aprovechamiento del almacenamiento en caché.");
  }

  if (!auditResult.technicalResults.mobileOptimization) {
    recommendations.push("Implementar un diseño responsivo que se adapte a todos los tamaños de pantalla y dispositivos.");
  }

  if (!auditResult.technicalResults.robotsTxt || !auditResult.technicalResults.sitemap) {
    recommendations.push("Crear y optimizar el archivo robots.txt y el sitemap XML para mejorar el rastreo e indexación del sitio.");
  }

  if (auditResult.seoResults.keywordDensity < 1) {
    recommendations.push("Aumentar estratégicamente la presencia de palabras clave relevantes en el contenido, manteniendo un enfoque natural y orientado al usuario.");
  }

  if (auditResult.seoResults.externalLinks < 3) {
    recommendations.push("Incorporar enlaces a fuentes externas de autoridad para aumentar la credibilidad del contenido.");
  }

  if (Object.values(auditResult.socialPresence).filter(Boolean).length < 3) {
    recommendations.push("Expandir la presencia en redes sociales e integrarlas adecuadamente en el sitio web para amplificar el alcance del contenido.");
  }

  // Siempre incluir algunas recomendaciones generales
  recommendations.push("Desarrollar una estrategia de contenido consistente que aborde las necesidades e intereses del público objetivo.");
  recommendations.push("Monitorizar regularmente las métricas SEO clave y ajustar la estrategia según los resultados obtenidos.");

  return recommendations;
};

// Función para generar explicaciones técnicas detalladas
const generateTechnicalExplanation = (auditResult: AuditResult): string => {
  return `
Análisis Técnico Detallado:

El sitio web presenta una puntuación SEO de ${auditResult.seoScore}% y una visibilidad web del ${auditResult.webVisibility}%. Estos indicadores sugieren ${auditResult.seoScore >= 70 ? "un buen fundamento" : "importantes áreas de mejora"} para el posicionamiento en buscadores.

Aspectos técnicos destacables:
- Implementación de SSL: ${auditResult.technicalResults.sslStatus === 'Válido' ? "Correcta" : "Requiere atención"}
- Redirección HTTPS: ${auditResult.technicalResults.httpsRedirection ? "Implementada" : "No implementada"}
- Optimización móvil: ${auditResult.technicalResults.mobileOptimization ? "Adecuada" : "Insuficiente"}
- Archivo robots.txt: ${auditResult.technicalResults.robotsTxt ? "Presente" : "Ausente"}
- Sitemap XML: ${auditResult.technicalResults.sitemap ? "Configurado" : "No encontrado"}

Rendimiento de página:
- Velocidad en escritorio: ${auditResult.performanceResults.pageSpeed.desktop}%
- Velocidad en móvil: ${auditResult.performanceResults.pageSpeed.mobile}%
- Tiempo de carga: ${auditResult.performanceResults.loadTime}

Estructura SEO on-page:
- Meta títulos: ${auditResult.seoResults.metaTitle ? "Correctos" : "Requieren optimización"}
- Meta descripciones: ${auditResult.seoResults.metaDescription ? "Implementadas" : "Ausentes o incorrectas"}
- Etiquetas H1: ${auditResult.seoResults.h1Tags} ${auditResult.seoResults.h1Tags === 0 ? "(insuficiente)" : "(adecuado)"}
- Longitud del contenido: ${auditResult.seoResults.contentLength} palabras
- Densidad de palabras clave: ${auditResult.seoResults.keywordDensity}%
- Enlaces internos: ${auditResult.seoResults.internalLinks}
- Enlaces externos: ${auditResult.seoResults.externalLinks}
- Etiquetas canónicas: ${auditResult.seoResults.canonicalTag ? "Implementadas" : "No implementadas"}

La arquitectura técnica del sitio ${auditResult.performance >= 70 && auditResult.technicalResults.sslStatus === 'Válido' ? "proporciona una base sólida" : "necesita mejoras significativas"} para el desarrollo posterior de estrategias de contenido y link building.
`;
};

// Función para generar explicaciones orientadas al cliente
const generateClientExplanation = (auditResult: AuditResult): string => {
  const scoreCategory = auditResult.seoScore >= 80 ? "buena" : auditResult.seoScore >= 60 ? "aceptable" : "baja";
  const urgencyLevel = auditResult.seoScore >= 80 ? "algunas mejoras estratégicas" : auditResult.seoScore >= 60 ? "varias optimizaciones importantes" : "intervenciones urgentes";
  
  return `
Estimado cliente:

Hemos realizado un análisis exhaustivo de su sitio web y queremos compartir los resultados y próximos pasos de manera clara y accesible.

Su sitio web muestra una puntuación SEO ${scoreCategory} (${auditResult.seoScore}%), lo que significa que ${
    auditResult.seoScore >= 80 
      ? "ya cuenta con muchos elementos fundamentales para un buen posicionamiento en buscadores" 
      : auditResult.seoScore >= 60 
        ? "tiene una base aceptable pero requiere mejoras para alcanzar su potencial completo" 
        : "necesita mejoras sustanciales para competir efectivamente en los resultados de búsqueda"
  }.

Lo que está funcionando bien:
${generateStrengths(auditResult).map(strength => `- ${strength}`).join('\n')}

Áreas que requieren atención:
${generateWeaknesses(auditResult).map(weakness => `- ${weakness}`).join('\n')}

Basándonos en este análisis, recomendamos implementar ${urgencyLevel} que mejorarán significativamente la visibilidad de su sitio web y su capacidad para atraer tráfico cualificado:

${generateRecommendations(auditResult).map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}

Con estas mejoras, podemos esperar un aumento en la visibilidad de su sitio web, mayor tráfico orgánico y, en última instancia, mejores resultados para su negocio.

Estamos a su disposición para implementar estas recomendaciones y continuar monitorizando y optimizando su presencia online. El SEO es un proceso continuo, y con una estrategia consistente, veremos mejoras progresivas en los resultados.

¿Le gustaría que programemos una reunión para discutir estas recomendaciones en detalle y establecer un plan de acción personalizado?
`;
};
