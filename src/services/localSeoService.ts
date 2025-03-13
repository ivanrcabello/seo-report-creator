
import { AuditResult } from "./pdfAnalyzer";
import { SeoLocalReport } from "@/types/client";
import { addLocalSeoReport } from "./clientService";

export interface LocalSeoAuditResult extends AuditResult {
  localSeoScore: number;
  googleBusinessProfile?: {
    claimed: boolean;
    completeness: number;
    reviews: {
      count: number;
      averageRating: number;
    };
  };
  localListings?: {
    platform: string;
    url?: string;
    status: 'claimed' | 'unclaimed' | 'inconsistent';
  }[];
  keywordRankings?: {
    keyword: string;
    position: number;
    localPosition?: number;
  }[];
  location?: string;
}

// Información empresarial extraída de los documentos
export interface BusinessInfo {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  businessHours?: string;
  industry?: string;
  targetLocations?: string[];
}

// Interfaz para el análisis de documentos de un cliente
export interface DocumentAnalysis {
  documentId: string;
  documentName: string;
  extractedInfo: string[];
  keyInsights: string[];
  relevantKeywords: string[];
}

// Simula el procesamiento de documentos y la generación de análisis
export const analyzeClientDocuments = async (documentIds: string[], clientId: string): Promise<DocumentAnalysis[]> => {
  console.log("Analizando documentos con IDs:", documentIds);
  
  // En una implementación real, aquí se procesarían los documentos PDF/imagen con servicios de OCR y NLP
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando procesamiento
  
  // Resultados simulados de análisis
  const mockAnalyses: DocumentAnalysis[] = documentIds.map(docId => ({
    documentId: docId,
    documentName: `Documento ${docId.substring(0, 4)}`,
    extractedInfo: [
      "La empresa opera en múltiples ubicaciones",
      "Público objetivo: pequeñas empresas locales",
      "Competencia principal: agencias digitales de la zona",
      "Actualmente sin presencia en Google Maps"
    ],
    keyInsights: [
      "No tiene optimizado su perfil de Google Business",
      "Inconsistencia en dirección y teléfono entre plataformas",
      "Falta de reseñas en plataformas principales"
    ],
    relevantKeywords: [
      "servicios digitales locales",
      "agencia marketing madrid",
      "posicionamiento web pymes",
      "seo para negocios locales",
      "marketing digital zona centro"
    ]
  }));
  
  return mockAnalyses;
};

// Extrae información empresarial de los documentos analizados
export const extractBusinessInfo = async (analyses: DocumentAnalysis[]): Promise<BusinessInfo> => {
  console.log("Extrayendo información empresarial de los análisis:", analyses);
  
  // En una implementación real, aquí se usaría NLP para extraer información específica
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando procesamiento
  
  // Información empresarial simulada
  return {
    name: "Negocio ABC",
    address: "Calle Gran Vía 123, Madrid",
    phone: "+34 912 345 678",
    website: "https://negocioabc.es",
    businessHours: "Lun-Vie: 9:00-18:00",
    industry: "Servicios Digitales",
    targetLocations: ["Madrid Centro", "Alcobendas", "Pozuelo"]
  };
};

// Genera un análisis SEO local basado en documentos analizados
export const generateLocalSeoAnalysis = async (documentIds: string[], clientId: string, clientName: string): Promise<LocalSeoAuditResult> => {
  console.log("Generando análisis SEO local para los documentos:", documentIds);
  
  // Simular análisis de documentos
  const documentAnalyses = await analyzeClientDocuments(documentIds, clientId);
  
  // Simular extracción de información empresarial
  const businessInfo = await extractBusinessInfo(documentAnalyses);
  
  // En una implementación real, aquí se utilizarían APIs de SEO para verificar rankings
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulando consultas API
  
  // Resultado de análisis SEO local simulado
  const localSeoResult: LocalSeoAuditResult = {
    seoScore: Math.floor(Math.random() * 30) + 40, // 40-70
    webVisibility: Math.floor(Math.random() * 25) + 25, // 25-50
    localSeoScore: Math.floor(Math.random() * 40) + 30, // 30-70
    performance: Math.floor(Math.random() * 30) + 50, // 50-80
    technicalResults: {
      sslStatus: 'Válido',
      httpsRedirection: true,
      mobileOptimization: false,
      robotsTxt: false,
      sitemap: false
    },
    performanceResults: {
      pageSpeed: {
        mobile: Math.floor(Math.random() * 40) + 30, // 30-70
        desktop: Math.floor(Math.random() * 30) + 60 // 60-90
      },
      loadTime: `${(Math.random() * 5 + 2).toFixed(1)}s`
    },
    seoResults: {
      metaTitle: true,
      metaDescription: false,
      h1Tags: Math.floor(Math.random() * 3),
      contentLength: Math.floor(Math.random() * 800) + 200,
      keywordDensity: (Math.random() * 2).toFixed(1),
      internalLinks: Math.floor(Math.random() * 15),
      externalLinks: Math.floor(Math.random() * 5),
      canonicalTag: Math.random() > 0.5
    },
    socialPresence: {
      facebook: Math.random() > 0.6,
      instagram: Math.random() > 0.5,
      twitter: Math.random() > 0.7,
      linkedin: Math.random() > 0.4,
      youtube: Math.random() > 0.8
    },
    googleBusinessProfile: {
      claimed: Math.random() > 0.5,
      completeness: Math.floor(Math.random() * 60) + 20, // 20-80
      reviews: {
        count: Math.floor(Math.random() * 15),
        averageRating: (Math.random() * 3 + 2).toFixed(1) // 2.0-5.0
      }
    },
    localListings: [
      { platform: "Google Business Profile", status: Math.random() > 0.6 ? 'claimed' : 'unclaimed' },
      { platform: "Yelp", status: Math.random() > 0.7 ? 'claimed' : 'unclaimed' },
      { platform: "TripAdvisor", url: "https://example.com", status: Math.random() > 0.5 ? 'claimed' : 'unclaimed' },
      { platform: "Páginas Amarillas", status: Math.random() > 0.8 ? 'claimed' : 'unclaimed' },
      { platform: "Facebook Local", status: Math.random() > 0.4 ? 'claimed' : 'inconsistent' }
    ],
    keywordRankings: [
      { keyword: `${businessInfo.industry} ${businessInfo.targetLocations?.[0] || 'Madrid'}`, position: Math.floor(Math.random() * 50) + 10, localPosition: Math.floor(Math.random() * 20) + 1 },
      { keyword: `servicios ${businessInfo.industry?.toLowerCase()} cerca de mí`, position: Math.floor(Math.random() * 70) + 20, localPosition: Math.floor(Math.random() * 20) + 1 },
      { keyword: `${businessInfo.industry} mejor valorados ${businessInfo.targetLocations?.[0] || 'Madrid'}`, position: Math.floor(Math.random() * 90) + 30, localPosition: Math.floor(Math.random() * 30) + 1 }
    ],
    location: businessInfo.targetLocations?.[0] || "Madrid"
  };
  
  return localSeoResult;
};

// Crea un informe SEO local a partir de un análisis
export const createLocalSeoReport = async (analysis: LocalSeoAuditResult, clientId: string, clientName: string): Promise<SeoLocalReport> => {
  console.log("Creando informe SEO local a partir del análisis:", analysis);
  
  // Generar recomendaciones basadas en el análisis
  const recommendations: string[] = [];
  
  if (!analysis.googleBusinessProfile?.claimed) {
    recommendations.push("Reclamar y optimizar el perfil de Google Business");
  }
  
  if (analysis.googleBusinessProfile && analysis.googleBusinessProfile.completeness < 70) {
    recommendations.push("Completar toda la información en el perfil de Google Business incluyendo fotos, servicios y horarios");
  }
  
  if (analysis.googleBusinessProfile && analysis.googleBusinessProfile.reviews.count < 10) {
    recommendations.push("Implementar estrategia de solicitud de reseñas a clientes satisfechos");
  }
  
  analysis.localListings?.forEach(listing => {
    if (listing.status === 'unclaimed') {
      recommendations.push(`Reclamar perfil en ${listing.platform}`);
    } else if (listing.status === 'inconsistent') {
      recommendations.push(`Corregir información inconsistente en ${listing.platform}`);
    }
  });
  
  if (!analysis.seoResults.metaDescription) {
    recommendations.push("Añadir meta descripciones optimizadas con keywords locales");
  }
  
  if (analysis.seoResults.h1Tags < 1) {
    recommendations.push("Implementar etiquetas H1 con términos locales relevantes");
  }
  
  recommendations.push("Crear contenido específico para cada ubicación objetivo");
  recommendations.push("Implementar schema markup para negocios locales");
  recommendations.push("Obtener enlaces desde directorios locales relevantes");
  
  // Crear el informe SEO local
  const localSeoReport: Omit<SeoLocalReport, "id"> = {
    clientId,
    title: `Informe SEO Local - ${clientName}`,
    date: new Date().toISOString(),
    businessName: clientName,
    location: analysis.location || "Madrid",
    googleMapsRanking: Math.floor(Math.random() * 20) + 1, // 1-20
    localListings: analysis.localListings,
    keywordRankings: analysis.keywordRankings,
    recommendations
  };
  
  // Guardar y retornar el informe
  return addLocalSeoReport(localSeoReport);
};
