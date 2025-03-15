
import { AuditResult } from "./pdfAnalyzer";
import { getSeoPacks } from "./packService";

export interface AIReport {
  summary: string;
  clientExplanation: string;
  technicalExplanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  // Campos adicionales para el informe ampliado
  companyIntroduction: string;
  webAnalysis: {
    authorityScore: number;
    organicTraffic: number;
    keywordsRanked: number;
    backlinks: number;
    qualityScore: number;
    priorityKeywords: Array<{keyword: string, position: number, volume: number, difficulty: number, recommendation: string}>;
    competitors: Array<{name: string, score: number, traffic: number, keywords: number, comparison: string}>;
  };
  strategy: {
    technicalOptimization: string[];
    localSeo: string[];
    contentCreation: string[];
    linkBuilding?: string[]; // Añadido para estrategia de linkbuilding
  };
  metrics: { // Añadido para métricas y KPIs
    trafficIncrease: string;
    positionImprovement: string;
    conversionIncrease: string;
    timeframe: string;
  };
  conclusion: string;
  contactInfo: {
    email: string;
    phone: string;
    responsiblePerson?: string; // Añadido para el responsable del proyecto
  };
  estimatedResultsTime: number; // en meses
  cronogram?: { // Añadido para el cronograma
    audit: string;
    implementation: string;
    review: string;
    reporting: string;
  };
}

export const generateAIReport = async (auditResult: AuditResult): Promise<AIReport> => {
  // En una implementación real, aquí se enviarían los datos del análisis a una API de IA
  // y se generaría un informe personalizado
  
  console.log("Generando informe con IA basado en los resultados del análisis");
  
  // Esperar para simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Obtener paquetes SEO disponibles para mostrarlos en el informe
  const seoPacks = await getSeoPacks();
  
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
  
  // Generar palabras clave de ejemplo basadas en el análisis
  const exampleKeywords = [
    {
      keyword: auditResult.technicalResults.technologies.includes("WordPress") ? "wordpress seo " + (auditResult.domain || "example.com") : "agencia seo " + (auditResult.domain || "example.com"),
      position: Math.floor(Math.random() * 30) + 10,
      volume: Math.floor(Math.random() * 500) + 100,
      difficulty: Math.floor(Math.random() * 60) + 20,
      recommendation: "Optimizar meta títulos y crear contenido especializado"
    },
    {
      keyword: "servicios " + (auditResult.companyType || "profesionales") + " " + (auditResult.location || "Madrid"),
      position: Math.floor(Math.random() * 20) + 5,
      volume: Math.floor(Math.random() * 800) + 200,
      difficulty: Math.floor(Math.random() * 40) + 30,
      recommendation: "Crear página específica optimizada para esta keyword"
    },
    {
      keyword: "mejor " + (auditResult.companyType || "empresa") + " " + (auditResult.location || "Madrid"),
      position: Math.floor(Math.random() * 50) + 15,
      volume: Math.floor(Math.random() * 1000) + 300,
      difficulty: Math.floor(Math.random() * 70) + 40,
      recommendation: "Obtener más reseñas y mejorar perfil de Google Business"
    }
  ];
  
  // Generar competidores de ejemplo
  const exampleCompetitors = [
    {
      name: "competidor1.com",
      score: Math.floor(Math.random() * 30) + 40,
      traffic: Math.floor(Math.random() * 5000) + 1000,
      keywords: Math.floor(Math.random() * 500) + 100,
      comparison: "Su competidor tiene mayor autoridad pero menos contenido optimizado"
    },
    {
      name: "competidor2.com",
      score: Math.floor(Math.random() * 20) + 30,
      traffic: Math.floor(Math.random() * 3000) + 800,
      keywords: Math.floor(Math.random() * 300) + 80,
      comparison: "Tiene mejor optimización técnica pero menor presencia en redes sociales"
    }
  ];
  
  // Estrategias de optimización técnica
  const technicalOptimization = [
    "Rediseño de la arquitectura web para mejorar la indexabilidad de páginas relevantes",
    "Optimización de metaetiquetas (title, description) para aumentar CTR en resultados de búsqueda",
    "Mejora de la velocidad de carga, especialmente en móviles (objetivo PageSpeed >80)",
    "Implementación de etiquetas de datos estructurados para destacar en resultados con rich snippets",
    "Corrección de enlaces rotos y redirecciones incorrectas"
  ];
  
  // Estrategias de SEO local
  const localSeo = [
    `Creación/optimización de perfil Google Business en ${auditResult.location || "su localidad"}`,
    `Desarrollo de páginas específicas para localidades cercanas a ${auditResult.location || "su área"}`,
    "Implementación de schema markup local para mejorar resultados en búsquedas geográficas",
    "Estrategia de reseñas para aumentar valoración y visibilidad local",
    "Creación de contenido local relevante (eventos, noticias, colaboraciones)"
  ];
  
  // Estrategias de creación de contenido
  const contentCreation = [
    "Desarrollo de blog con publicación semanal de artículos optimizados para keywords relevantes",
    "Creación de guías y recursos descargables para generar leads",
    `Contenido específico para resolver problemáticas habituales en ${auditResult.companyType || "su sector"}`,
    "Optimización y expansión de páginas de servicios existentes",
    "Implementación de calendario editorial con temáticas estacionales relevantes"
  ];
  
  // Estrategias de linkbuilding
  const linkBuilding = [
    "Análisis y desautorización de backlinks tóxicos existentes",
    "Estrategia de guest posting en sitios relevantes de su sector",
    "Desarrollo de piezas de contenido linkable (infografías, estudios, guías)",
    "Menciones de marca y aparición en directorios sectoriales de calidad",
    "Colaboraciones con influencers y empresas complementarias"
  ];
  
  // Cronograma de implementación
  const cronogram = {
    audit: "Semanas 1-2: Auditoría técnica completa y preparación de la estrategia",
    implementation: "Semanas 3-6: Implementación de cambios técnicos y optimizaciones on-page",
    review: "Semana 8: Primera revisión de resultados y ajustes de estrategia",
    reporting: "Mensual: Entrega de informes detallados de evolución y resultados"
  };
  
  // Métricas y KPIs
  const metrics = {
    trafficIncrease: "Incremento de tráfico orgánico entre un 30-50% en 6 meses",
    positionImprovement: "Mejora de posiciones para keywords principales (Top 10) en 4-5 meses",
    conversionIncrease: "Aumento de conversiones desde tráfico orgánico del 15-25% en 6 meses",
    timeframe: "Primeros resultados visibles a partir del 3er mes, mejoras significativas a los 6 meses"
  };
  
  // Generar el informe completo
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
    ],
    
    // Nuevos campos para el informe ampliado
    companyIntroduction: `${auditResult.companyName || "Su empresa"} se dedica a ofrecer servicios de ${auditResult.companyType || "profesionales"} en ${auditResult.location || "su área geográfica"}. Este informe tiene como objetivo analizar su presencia online actual y proponer una estrategia SEO completa para mejorar su visibilidad en buscadores, aumentar el tráfico orgánico y local, y convertir más visitantes en potenciales clientes. Implementando las recomendaciones de este informe, su negocio podrá destacar entre la competencia y captar una mayor cuota de mercado en su sector.`,
    
    webAnalysis: {
      authorityScore: Math.floor(auditResult.seoScore * 0.8),
      organicTraffic: Math.floor(Math.random() * 1000) + 100,
      keywordsRanked: Math.floor(Math.random() * 50) + 10,
      backlinks: Math.floor(Math.random() * 100) + 5,
      qualityScore: Math.floor(Math.random() * 70) + 30,
      priorityKeywords: exampleKeywords,
      competitors: exampleCompetitors
    },
    
    strategy: {
      technicalOptimization: technicalOptimization,
      localSeo: localSeo,
      contentCreation: contentCreation,
      linkBuilding: linkBuilding
    },
    
    metrics: metrics,
    
    conclusion: `Basándonos en el análisis realizado, recomendamos implementar un plan ${auditResult.seoScore < 60 ? "Completo" : auditResult.seoScore < 75 ? "Avanzado" : "Estándar"} de SEO para su sitio web. Este enfoque permitirá abordar las principales áreas de mejora identificadas y potenciar sus fortalezas actuales. Los primeros resultados comenzarán a ser visibles a partir del tercer mes de implementación, con mejoras progresivas en posicionamiento y tráfico a medida que Google reconozca los cambios realizados. Para objetivos más ambiciosos o resultados más rápidos, considere el plan ${auditResult.seoScore < 70 ? "Premium" : "Completo"}.`,
    
    contactInfo: {
      email: "seo@tuagencia.com",
      phone: "+34 612 345 678",
      responsiblePerson: "Responsable SEO: María García"
    },
    
    estimatedResultsTime: 3, // resultados visibles a partir del tercer mes
    
    cronogram: cronogram
  };
};
