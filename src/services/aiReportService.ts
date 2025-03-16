
import { AuditResult } from "./pdfAnalyzer";

export interface PriorityKeyword {
  keyword: string;
  position?: number;
  volume?: number;
  difficulty?: number;
  recommendation?: string;
}

export interface Competitor {
  name: string;
  trafficScore?: number;
  keywordsCount?: number;
  backlinksCount?: number;
  analysis?: string;
}

export interface Package {
  name: string;
  price: number;
  features: string[];
}

export interface AIReport {
  id?: string;
  introduction?: string;
  authorityScore?: number;
  authorityScoreComment?: string;
  organicTraffic?: string;
  organicTrafficComment?: string;
  keywordsPositioned?: string;
  keywordsComment?: string;
  backlinksCount?: string;
  backlinksComment?: string;
  priorityKeywords?: PriorityKeyword[];
  competitors?: Competitor[];
  strategy?: {
    technicalOptimization?: string[];
    localSeo?: string[];
    contentCreation?: string[];
    linkBuilding?: string[];
  };
  packages?: Package[];
  conclusion?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Add formatted content field for report display
  content?: string;
}

export const generateAIReport = async (auditResult: AuditResult): Promise<AIReport> => {
  // Generate a temporary ID for the report
  const tempId = 'report-' + Math.random().toString(36).substring(2, 9);
  
  // Generate sample report based on provided data
  const report: AIReport = {
    id: tempId,
    introduction: `Este informe presenta un análisis completo de la presencia online de ${auditResult.companyName || "su empresa"} en ${auditResult.location || "su ubicación"}. El objetivo es mejorar su visibilidad en los motores de búsqueda, aumentar el tráfico orgánico y local, y captar nuevos clientes a través de estrategias SEO adaptadas a su sector (${auditResult.companyType || "industria"}).`,
    
    authorityScore: 37,
    authorityScoreComment: "Puntuación media-baja. Hay margen de mejora significativo en la autoridad del dominio.",
    
    organicTraffic: "850",
    organicTrafficComment: "El tráfico orgánico actual es moderado para el sector. Con optimizaciones adecuadas, podría incrementarse hasta un 200% en 6 meses.",
    
    keywordsPositioned: "42",
    keywordsComment: "La web posiciona para pocas palabras clave relevantes. Existe potencial para ampliar considerablemente este número.",
    
    backlinksCount: "156",
    backlinksComment: "El perfil de enlaces es débil y necesita una estrategia de linkbuilding activa para mejorarlo.",
    
    priorityKeywords: [
      {
        keyword: auditResult.keywords ? auditResult.keywords[0]?.word || "keyword 1" : "keyword 1",
        position: 18,
        volume: 2900,
        difficulty: 44,
        recommendation: "Optimizar la meta descripción y crear contenido especializado sobre este tema."
      },
      {
        keyword: auditResult.keywords ? auditResult.keywords[1]?.word || "keyword 2" : "keyword 2",
        position: 24,
        volume: 1800,
        difficulty: 39,
        recommendation: "Mejorar la estructura de encabezados H1, H2 y crear contenido complementario."
      },
      {
        keyword: "keyword 3",
        position: 32,
        volume: 1200,
        difficulty: 35,
        recommendation: "Crear un artículo detallado que responda a las preguntas frecuentes sobre este término."
      }
    ],
    
    competitors: [
      {
        name: "competidor1.com",
        trafficScore: 78,
        keywordsCount: 1240,
        backlinksCount: 890,
        analysis: "Su principal competidor tiene un mejor perfil de enlaces y más contenido optimizado."
      },
      {
        name: "competidor2.com",
        trafficScore: 62,
        keywordsCount: 860,
        backlinksCount: 450,
        analysis: "Posiciona bien para términos de long-tail y tiene buena presencia en directorios locales."
      }
    ],
    
    strategy: {
      technicalOptimization: [
        "Corregir las 3 páginas con errores de canonicalización detectadas.",
        "Optimizar la velocidad de carga en dispositivos móviles (actualmente 4.2s, objetivo 2.5s).",
        "Implementar schema markup para Rich Snippets en los servicios principales.",
        "Corregir estructura de H1, H2 y H3 en páginas principales para mejorar la jerarquía de contenidos.",
        "Optimizar las meta descripciones de las 15 páginas principales con mayor potencial."
      ],
      
      localSeo: [
        "Crear páginas específicas para cada una de las 3 localidades principales donde operan.",
        "Optimizar la ficha de Google My Business con fotos actualizadas mensualmente.",
        "Obtener 10 nuevas reseñas positivas en Google Maps en los próximos 3 meses.",
        "Incluir referencias geográficas naturales en textos de páginas principales.",
        "Registrarse en los 5 directorios locales más relevantes del sector."
      ],
      
      contentCreation: [
        "Desarrollar un calendario editorial con 2 artículos mensuales enfocados en palabras clave prioritarias.",
        "Crear una sección de preguntas frecuentes basada en búsquedas de usuarios.",
        "Actualizar y ampliar el contenido de las 5 páginas más importantes del sitio.",
        "Crear contenido multimedia (infografías, videos) para aumentar el tiempo de permanencia.",
        "Incorporar testimonios de clientes y casos de éxito para reforzar la confianza."
      ],
      
      linkBuilding: [
        "Desarrollar una campaña de guest posting en 5 blogs del sector.",
        "Crear un informe sectorial para conseguir menciones y enlaces.",
        "Establecer alianzas con 3 empresas complementarias para intercambio de enlaces.",
        "Reparar los 7 enlaces rotos detectados en la auditoría.",
        "Mejorar la calidad de los enlaces internos entre páginas relacionadas."
      ]
    },
    
    packages: [
      {
        name: "Plan Básico",
        price: 490,
        features: [
          "Auditoría SEO técnica",
          "Optimización on-page (5 páginas)",
          "Configuración Google Search Console",
          "Informe mensual de resultados",
          "Soporte por email"
        ]
      },
      {
        name: "Plan Crecimiento",
        price: 990,
        features: [
          "Todo lo incluido en Plan Básico",
          "Optimización on-page completa",
          "Estrategia de contenidos (2 artículos/mes)",
          "SEO Local básico",
          "5 enlaces de calidad mensual",
          "Soporte prioritario"
        ]
      },
      {
        name: "Plan Premium",
        price: 1890,
        features: [
          "Todo lo incluido en Plan Crecimiento",
          "Estrategia de linkbuilding avanzada",
          "Creación de contenido premium (4 artículos/mes)",
          "SEO Local completo",
          "Optimización CRO básica",
          "Reuniones quincenales de seguimiento"
        ]
      }
    ],
    
    conclusion: "Basándonos en nuestro análisis, recomendamos empezar con el Plan Crecimiento, que ofrece el mejor equilibrio entre inversión y resultados para este caso. Los primeros resultados serían visibles a partir del tercer mes, con mejoras significativas en el posicionamiento de palabras clave principales y un incremento de tráfico orgánico de al menos un 30%. Para empresas con mayor competencia o que buscan resultados más rápidos, el Plan Premium sería la opción ideal.",
    
    contactEmail: "info@agenciaseo.com",
    contactPhone: "+34 612 345 678"
  };
  
  // Generate the formatted content for display
  report.content = await generateFormattedContent(report, auditResult);
  
  // Simulate processing time
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(report);
    }, 1500);
  });
};

// Helper function to generate formatted markdown content for the report
async function generateFormattedContent(report: AIReport, auditResult: AuditResult): Promise<string> {
  // Try to get enhanced content using OpenAI
  try {
    const enhancedContent = await getOpenAIReport(auditResult);
    if (enhancedContent) {
      return enhancedContent;
    }
  } catch (error) {
    console.error("Error generating OpenAI report:", error);
    // Continue with fallback report generation if OpenAI fails
  }

  // Fallback to basic report generation
  let content = '';
  
  // Introduction section
  content += `## Introducción\n\n${report.introduction || ''}\n\n`;
  
  // Analysis section
  content += `## Análisis de la Situación Actual\n\n`;
  content += `La web analizada (${auditResult.url || 'No especificada'}) presenta los siguientes indicadores:\n\n`;
  content += `- **Authority Score**: ${report.authorityScore}/100 - ${report.authorityScoreComment}\n`;
  content += `- **Tráfico Orgánico**: ${report.organicTraffic} visitas/mes - ${report.organicTrafficComment}\n`;
  content += `- **Palabras Clave Posicionadas**: ${report.keywordsPositioned} - ${report.keywordsComment}\n`;
  content += `- **Backlinks**: ${report.backlinksCount} - ${report.backlinksComment}\n\n`;
  
  // Technical issues section if available in the audit data
  if (auditResult && 'technicalIssues' in auditResult && Array.isArray(auditResult['technicalIssues']) && auditResult['technicalIssues']?.length > 0) {
    content += `### Problemas Técnicos Detectados\n\n`;
    auditResult['technicalIssues'].forEach((issue: any) => {
      content += `- **${issue.type || 'Problema'}**: ${issue.description || 'Sin descripción'}\n`;
    });
    content += `\n`;
  }
  
  // Keywords section
  if (report.priorityKeywords && report.priorityKeywords.length > 0) {
    content += `## Palabras Clave Prioritarias\n\n`;
    content += `Las siguientes palabras clave representan oportunidades de posicionamiento para su negocio:\n\n`;
    report.priorityKeywords.forEach(keyword => {
      content += `### ${keyword.keyword}\n`;
      content += `- **Posición actual**: ${keyword.position || 'No posicionada'}\n`;
      content += `- **Volumen de búsqueda**: ${keyword.volume || 'N/A'} búsquedas/mes\n`;
      content += `- **Dificultad**: ${keyword.difficulty || 'N/A'}/100\n`;
      content += `- **Recomendación**: ${keyword.recommendation || 'N/A'}\n\n`;
    });
  }
  
  // Competitors section
  if (report.competitors && report.competitors.length > 0) {
    content += `## Análisis de Competidores\n\n`;
    report.competitors.forEach(competitor => {
      content += `### ${competitor.name}\n`;
      content += `- **Score de tráfico**: ${competitor.trafficScore || 'N/A'}/100\n`;
      content += `- **Palabras clave**: ${competitor.keywordsCount || 'N/A'}\n`;
      content += `- **Backlinks**: ${competitor.backlinksCount || 'N/A'}\n`;
      content += `- **Análisis**: ${competitor.analysis || 'N/A'}\n\n`;
    });
  }
  
  // Strategy section
  content += `## Estrategia Propuesta\n\n`;
  
  if (report.strategy?.technicalOptimization) {
    content += `### Optimización Técnica\n\n`;
    report.strategy.technicalOptimization.forEach(item => {
      content += `- ${item}\n`;
    });
    content += `\n`;
  }
  
  if (report.strategy?.localSeo) {
    content += `### SEO Local\n\n`;
    report.strategy.localSeo.forEach(item => {
      content += `- ${item}\n`;
    });
    content += `\n`;
  }
  
  if (report.strategy?.contentCreation) {
    content += `### Estrategia de Contenidos\n\n`;
    report.strategy.contentCreation.forEach(item => {
      content += `- ${item}\n`;
    });
    content += `\n`;
  }
  
  if (report.strategy?.linkBuilding) {
    content += `### Estrategia de Linkbuilding\n\n`;
    report.strategy.linkBuilding.forEach(item => {
      content += `- ${item}\n`;
    });
    content += `\n`;
  }
  
  // Packages section
  if (report.packages && report.packages.length > 0) {
    content += `## Planes Recomendados\n\n`;
    report.packages.forEach(pkg => {
      content += `### ${pkg.name} - ${pkg.price}€/mes\n\n`;
      pkg.features.forEach(feature => {
        content += `- ${feature}\n`;
      });
      content += `\n`;
    });
  }
  
  // Conclusion section
  content += `## Conclusión\n\n${report.conclusion || ''}\n\n`;
  
  // Contact info
  content += `## Contacto\n\n`;
  content += `Para más información, no dude en contactar con nosotros:\n\n`;
  content += `- Email: ${report.contactEmail || 'info@agenciaseo.com'}\n`;
  content += `- Teléfono: ${report.contactPhone || '+34 612 345 678'}\n`;
  
  return content;
}

// Function to generate a report using OpenAI
async function getOpenAIReport(auditResult: AuditResult): Promise<string | null> {
  try {
    const response = await fetch('/api/openai-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auditResult
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
}
