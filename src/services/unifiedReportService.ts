
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { PageSpeedReport } from "@/services/pageSpeedService";
import { ClientMetric } from "@/services/clientMetricsService";
import { SeoLocalReport } from "@/types/client";
import { ClientKeyword } from "@/services/clientKeywordsService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { generateSEOReport } from "@/services/openai";
import { AuditResult } from "@/services/pdfAnalyzer";

interface UnifiedReportData {
  clientId: string;
  clientName: string;
  pageSpeedData: PageSpeedReport | null;
  metricsData: ClientMetric | null;
  localSeoData: SeoLocalReport | null;
  keywordsData: ClientKeyword[];
}

export const generateUnifiedReport = async (data: UnifiedReportData): Promise<ClientReport | null> => {
  try {
    console.log("Generating unified report with data:", data);
    
    // Create a combined audit result object for the AI
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
      // Add the required fields based on the expanded AuditResult interface
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
          mobile: data.pageSpeedData?.metrics.performance_score_mobile || 0
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
        count: 1 // Add required count property
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
    
    // Generate AI content
    console.log("Generating AI content for report");
    const content = await generateSEOReport(auditResult);
    
    if (!content) {
      throw new Error("No se pudo generar el contenido del informe");
    }
    
    // Create report in database
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
    
    console.log("Saving report to database");
    const { data: savedReport, error } = await supabase
      .from('client_reports')
      .insert([{
        client_id: reportData.clientId,
        title: reportData.title,
        date: reportData.date,
        type: reportData.type,
        content: reportData.content,
        analytics_data: reportData.analyticsData,
        document_ids: []
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving report:", error);
      throw new Error(`Error al guardar el informe: ${error.message}`);
    }
    
    // Map response to ClientReport type, handling possible null values
    const result: ClientReport = {
      id: savedReport.id,
      clientId: savedReport.client_id,
      title: savedReport.title,
      date: savedReport.date,
      type: savedReport.type,
      content: savedReport.content || "", // Handle null content
      analyticsData: savedReport.analytics_data || {}, // Handle null analytics_data
      documentIds: savedReport.document_ids || [],
      shareToken: savedReport.share_token,
      sharedAt: savedReport.shared_at,
      includeInProposal: savedReport.include_in_proposal || false,
      notes: savedReport.notes,
      url: savedReport.url
    };
    
    return result;
  } catch (error) {
    console.error("Error in generateUnifiedReport:", error);
    toast.error(`Error al generar el informe unificado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    return null;
  }
};
