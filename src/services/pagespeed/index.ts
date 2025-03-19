
import { analyzePageSpeed } from './pageSpeedAnalyzer';
import { savePageSpeedResults, deletePageSpeedMetric } from './pageSpeedDbService';
import { getPageSpeedHistory, getLatestPageSpeedMetrics } from './pageSpeedHistoryService';
import { analyzeWebsite } from './pageSpeedApiService';
import { PageSpeedMetrics, PageSpeedAuditItem, PageSpeedReport, PageSpeedAnalysisOptions } from './types';

// Re-export all types
export type { 
  PageSpeedMetrics, 
  PageSpeedAuditItem, 
  PageSpeedReport, 
  PageSpeedAnalysisOptions 
};

// Re-export for compatibility with old code
export type { PageSpeedAuditItem as PageSpeedAudit };

// Re-export all functions
export { 
  analyzePageSpeed,
  savePageSpeedResults,
  deletePageSpeedMetric,
  getPageSpeedHistory,
  getLatestPageSpeedMetrics,
  analyzeWebsite
};

// Import supabase
import { supabase } from "@/integrations/supabase/client";

// Function to match the expected getPageSpeedReport API
export const getPageSpeedReport = async (clientId: string): Promise<PageSpeedReport | null> => {
  try {
    console.log("Getting latest PageSpeed report for client:", clientId);
    
    const { data, error } = await supabase
      .from('client_pagespeed')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      console.error("Error getting PageSpeed report:", error);
      throw new Error(`Error getting report: ${error.message}`);
    }
    
    if (!data) return null;
    
    // Convert the database record to a PageSpeedReport
    const metrics: PageSpeedMetrics = {
      url: data.url,
      performance_score: data.performance_score,
      accessibility_score: data.accessibility_score,
      best_practices_score: data.best_practices_score,
      seo_score: data.seo_score,
      first_contentful_paint: data.first_contentful_paint,
      speed_index: data.speed_index,
      largest_contentful_paint: data.largest_contentful_paint,
      time_to_interactive: data.time_to_interactive,
      total_blocking_time: data.total_blocking_time,
      cumulative_layout_shift: data.cumulative_layout_shift,
      timestamp: data.created_at
    };
    
    // Parse audit items from the DB - handle different property naming
    let auditItems: PageSpeedAuditItem[] = [];
    
    // Safely check for audit_items or audits property and convert properly
    if ('audit_items' in data && Array.isArray(data.audit_items)) {
      auditItems = data.audit_items as unknown as PageSpeedAuditItem[];
    } else if ('audits' in data && Array.isArray(data.audits)) {
      auditItems = data.audits as unknown as PageSpeedAuditItem[];
    }
    
    // Get full report - handle different property naming
    let fullReport = null;
    
    if ('full_report' in data) {
      fullReport = data.full_report;
    } else if ('fullReport' in data) {
      fullReport = data.fullReport;
    }
    
    return {
      id: data.id,
      metrics,
      auditItems,
      fullReport,
      created_at: data.created_at
    };
  } catch (error) {
    console.error("Error in getPageSpeedReport:", error);
    return null;
  }
};

// Save function to match expected API
export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  return savePageSpeedResults(clientId, report);
};
