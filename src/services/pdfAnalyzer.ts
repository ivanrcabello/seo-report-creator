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
}
