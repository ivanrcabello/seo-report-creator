
import { supabase } from "@/integrations/supabase/client";
import { ClientReport } from "@/types/client";
import { PageSpeedReport } from "@/services/pageSpeedService";
import { ClientMetric } from "@/services/clientMetricsService";
import { SeoLocalReport } from "@/types/client";
import { ClientKeyword } from "@/services/clientKeywordsService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { generateSEOReport } from "@/services/openai";

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
    const auditResult = {
      clientName: data.clientName,
      metrics: {
        webVisits: data.metricsData?.web_visits || 0,
        keywordsTop10: data.metricsData?.keywords_top10 || 0,
        conversions: data.metricsData?.conversions || 0,
        conversionGoal: data.metricsData?.conversion_goal || 0,
      },
      pagespeed: data.pageSpeedData ? {
        scores: {
          performance: data.pageSpeedData.metrics.performance_score,
          accessibility: data.pageSpeedData.metrics.accessibility_score,
          bestPractices: data.pageSpeedData.metrics.best_practices_score,
          seo: data.pageSpeedData.metrics.seo_score,
        },
        metrics: {
          firstContentfulPaint: data.pageSpeedData.metrics.first_contentful_paint,
          speedIndex: data.pageSpeedData.metrics.speed_index,
          largestContentfulPaint: data.pageSpeedData.metrics.largest_contentful_paint,
          timeToInteractive: data.pageSpeedData.metrics.time_to_interactive,
          totalBlockingTime: data.pageSpeedData.metrics.total_blocking_time,
          cumulativeLayoutShift: data.pageSpeedData.metrics.cumulative_layout_shift,
        },
        url: data.pageSpeedData.metrics.url,
      } : null,
      localSeo: data.localSeoData ? {
        businessName: data.localSeoData.businessName,
        location: data.localSeoData.location,
        googleMapsRanking: data.localSeoData.googleMapsRanking,
        keywordRankings: data.localSeoData.keywordRankings,
      } : null,
      keywords: data.keywordsData.map(kw => ({
        keyword: kw.keyword,
        position: kw.position,
        targetPosition: kw.target_position,
      })),
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
        analytics_data: reportData.analyticsData
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving report:", error);
      throw new Error(`Error al guardar el informe: ${error.message}`);
    }
    
    // Map response to ClientReport type
    const result: ClientReport = {
      id: savedReport.id,
      clientId: savedReport.client_id,
      title: savedReport.title,
      date: savedReport.date,
      type: savedReport.type,
      content: savedReport.content,
      analyticsData: savedReport.analytics_data,
      documentIds: null,
      shareToken: null,
      sharedAt: null,
      includeInProposal: false,
      notes: null,
      url: null,
    };
    
    return result;
  } catch (error) {
    console.error("Error in generateUnifiedReport:", error);
    toast.error(`Error al generar el informe unificado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    return null;
  }
};
