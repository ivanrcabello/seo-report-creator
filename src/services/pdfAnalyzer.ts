
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
  twitter: boolean;
  instagram: boolean;
  linkedin: boolean;
  googleBusiness: boolean;
}

export interface AuditResult {
  url: string;
  companyName: string;
  companyType: string;
  location: string;
  seoScore: number;
  performance: number;
  webVisibility: number;
  keywordsCount: number;
  technicalIssues: any[];
  seoResults: SeoResult;
  technicalResults: TechnicalResult;
  performanceResults: PerformanceResult;
  socialPresence: SocialPresence;
  keywords: {
    word: string;
    position?: number;
    targetPosition?: number;
    searchVolume?: number;
    difficulty?: number;
    count?: number;
  }[];
  localData?: {
    businessName: string;
    address: string;
    googleMapsRanking: number;
    googleReviews: number;
  };
  metrics?: {
    visits: number;
    keywordsTop10: number;
    conversions: number;
  };
  pagespeed?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
  };
  // Añadimos los campos faltantes que causaban errores
  scores?: {
    performance?: number;
    seo?: number;
    accessibility?: number;
    bestPractices?: number;
  };
  metaData?: {
    totalIssues?: number;
    criticalIssues?: number;
    warningIssues?: number;
    infoIssues?: number;
  };
}

// Mock function to analyze PDFs (this would be replaced by real implementation)
export const analyzePdf = async (file: File): Promise<AuditResult> => {
  // This is a mock implementation
  return {
    url: "https://example.com",
    companyName: "Example Company",
    companyType: "E-commerce",
    location: "Madrid, España",
    seoScore: 78,
    performance: 85,
    webVisibility: 65,
    keywordsCount: 12,
    technicalIssues: [],
    seoResults: {
      metaTitle: true,
      metaDescription: true,
      h1Tags: 3,
      canonicalTag: true,
      keywordDensity: 2.5,
      contentLength: 1500,
      internalLinks: 8,
      externalLinks: 4
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
      loadTime: '1.8s',
      resourceCount: 45,
      imageOptimization: true,
      cacheImplementation: true
    },
    socialPresence: {
      facebook: true,
      twitter: true,
      instagram: false,
      linkedin: true,
      googleBusiness: true
    },
    keywords: [
      { word: "SEO", position: 12, targetPosition: 5, searchVolume: 4500, difficulty: 65, count: 8 },
      { word: "Marketing digital", position: 18, targetPosition: 10, searchVolume: 3200, difficulty: 55, count: 6 },
      { word: "Agencia web", position: 25, targetPosition: 15, searchVolume: 2100, difficulty: 48, count: 5 }
    ]
  };
};

// Helper function to convert PDF to text
export const pdfToText = async (file: File): Promise<string> => {
  // This would be the actual implementation
  return "Extracted text from PDF file";
};
