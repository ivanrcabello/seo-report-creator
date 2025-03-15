
// Este servicio simula la extracción de datos de un PDF de auditoría SEO
// En una implementación real, se integraría con una biblioteca de análisis de PDF

export interface SeoResult {
  metaTitle: boolean;
  metaDescription: boolean;
  h1Tags: number;
  canonicalTag: boolean;
  keywordDensity: number;
  contentLength: number;
  internalLinks: number;
  externalLinks: number;
}

export interface TechnicalResult {
  sslStatus: 'Válido' | 'Inválido' | 'No implementado';
  httpsRedirection: boolean;
  mobileOptimization: boolean;
  robotsTxt: boolean;
  sitemap: boolean;
  technologies: string[];
}

export interface PerformanceResult {
  pageSpeed: {
    desktop: number;
    mobile: number;
  };
  loadTime: string;
  resourceCount: number;
  imageOptimization: boolean;
  cacheImplementation: boolean;
}

export interface SocialPresence {
  facebook: boolean;
  instagram: boolean;
  twitter: boolean;
  linkedin: boolean;
  googleBusiness: boolean;
}

export interface AuditResult {
  url?: string;
  domain?: string; // Añadido para referir al dominio del sitio web
  score?: number;
  seoScore: number;
  performanceScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  webVisibility: number;
  performance: number;
  keywordsCount: number;
  loadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  recommendations?: string[];
  errors?: string[];
  warnings?: string[];
  keywords?: { word: string; count: number }[];
  metadata?: Record<string, string>;
  seoResults: SeoResult;
  technicalResults: TechnicalResult;
  performanceResults: PerformanceResult;
  socialPresence: SocialPresence;
  // Campos adicionales para información del cliente
  companyName?: string;
  companyType?: string;
  location?: string;
}

// Función para extraer texto de un PDF (simulada)
export const pdfToText = async (fileUrl: string): Promise<string> => {
  // En una implementación real, utilizaríamos una biblioteca para extraer el texto del PDF
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Contenido simulado del PDF extraído de ${fileUrl}.
      Este es un ejemplo de texto que podría extraerse de un PDF de auditoría.
      Normalmente incluiría detalles sobre el rendimiento del sitio, problemas de SEO, etc.`);
    }, 1000);
  });
};

// Función para analizar un PDF y extraer datos relevantes
export const analyzePdf = async (file: File): Promise<AuditResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: "https://example.com",
        domain: "example.com", // Añadido
        score: 85,
        seoScore: 94,
        performanceScore: 90,
        accessibilityScore: 88,
        bestPracticesScore: 82,
        webVisibility: 78,
        performance: 87,
        keywordsCount: 18,
        loadTime: 2.3,
        firstContentfulPaint: 0.8,
        largestContentfulPaint: 1.2,
        timeToInteractive: 3.1,
        recommendations: [
          "Optimiza las imágenes para reducir el tiempo de carga",
          "Mejora la estructura de los encabezados H1, H2, H3",
          "Añade metadescripciones a todas las páginas",
          "Corrige los enlaces rotos encontrados en la página de contacto"
        ],
        errors: [
          "3 enlaces rotos detectados",
          "Falta el atributo alt en 5 imágenes"
        ],
        warnings: [
          "El tiempo de carga en dispositivos móviles supera los 3 segundos",
          "La relación texto/HTML es baja"
        ],
        keywords: [
          { word: "seo", count: 15 },
          { word: "optimización", count: 12 },
          { word: "marketing", count: 8 }
        ],
        metadata: {
          title: "Ejemplo de Auditoría SEO",
          description: "Resultados del análisis SEO para example.com",
          author: "Herramienta de Auditoría SEO"
        },
        seoResults: {
          metaTitle: true,
          metaDescription: true,
          h1Tags: 2,
          canonicalTag: true,
          keywordDensity: 2.5,
          contentLength: 1450,
          internalLinks: 23,
          externalLinks: 7
        },
        technicalResults: {
          sslStatus: 'Válido',
          httpsRedirection: true,
          mobileOptimization: true,
          robotsTxt: true,
          sitemap: true,
          technologies: ['WordPress', 'PHP', 'MySQL', 'jQuery']
        },
        performanceResults: {
          pageSpeed: {
            desktop: 88,
            mobile: 72
          },
          loadTime: '2.3s',
          resourceCount: 45,
          imageOptimization: false,
          cacheImplementation: true
        },
        socialPresence: {
          facebook: true,
          instagram: true,
          twitter: true,
          linkedin: false,
          googleBusiness: true
        },
        // Campos adicionales simulados
        companyName: "Empresa Ejemplo",
        companyType: "Comercio electrónico",
        location: "Madrid"
      });
    }, 2000);
  });
};
