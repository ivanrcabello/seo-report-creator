
import { supabase } from "@/integrations/supabase/client";
import { PageSpeedReport, PageSpeedAudit } from "./types";
import { savePageSpeedMetrics } from "../pageSpeedMetricsService";
import { toast } from "sonner";

// Save a PageSpeed report for a client
export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    console.log("Saving PageSpeed report for client:", clientId);
    
    // Make sure all numeric fields have the correct type
    // Scores are stored as decimals (0-1) in the database
    const reportData = {
      client_id: clientId,
      url: report.metrics.url,
      performance_score: parseFloat(report.metrics.performance_score.toString()),
      accessibility_score: parseFloat(report.metrics.accessibility_score.toString()),
      best_practices_score: parseFloat(report.metrics.best_practices_score.toString()),
      seo_score: parseFloat(report.metrics.seo_score.toString()),
      first_contentful_paint: report.metrics.first_contentful_paint,
      speed_index: report.metrics.speed_index,
      largest_contentful_paint: report.metrics.largest_contentful_paint,
      time_to_interactive: report.metrics.time_to_interactive,
      total_blocking_time: report.metrics.total_blocking_time,
      cumulative_layout_shift: report.metrics.cumulative_layout_shift,
      audits: JSON.stringify(report.audits)
    };
    
    // First save to client_pagespeed table
    const { data, error } = await supabase
      .from('client_pagespeed')
      .insert([reportData])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving PageSpeed report:", error);
      toast.error("Error al guardar el informe de PageSpeed");
      return false;
    }
    
    console.log("PageSpeed report saved:", data);
    
    // Then save metrics to the metrics tracking table
    await savePageSpeedMetrics(clientId, report);
    
    toast.success("Informe de PageSpeed guardado correctamente");
    return true;
  } catch (error) {
    console.error("Exception saving PageSpeed report:", error);
    toast.error("Error al guardar el informe de PageSpeed");
    return false;
  }
};

// Get the most recent PageSpeed report for a client
export const getPageSpeedReport = async (clientId: string): Promise<PageSpeedReport | null> => {
  try {
    console.log("Getting PageSpeed report for client:", clientId);
    
    const { data, error } = await supabase
      .from('client_pagespeed')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching PageSpeed report:", error);
      return null;
    }
    
    if (!data) {
      console.log("No PageSpeed report found for client:", clientId);
      return null;
    }
    
    console.log("PageSpeed report retrieved");
    
    // Parse and transform the audits JSON data
    let parsedAudits: PageSpeedAudit[] = [];
    
    if (data.audits) {
      try {
        // If it's already a string, parse it
        const auditsData = typeof data.audits === 'string' 
          ? JSON.parse(data.audits) 
          : data.audits;
        
        // Ensure it's an array
        if (Array.isArray(auditsData)) {
          // Map each audit object to ensure it conforms to PageSpeedAudit structure
          parsedAudits = auditsData.map((audit: any) => ({
            id: audit.id || '',
            title: audit.title || '',
            description: audit.description || '',
            score: typeof audit.score === 'number' ? audit.score : 0,
            scoreDisplayMode: audit.scoreDisplayMode || 'numeric',
            displayValue: audit.displayValue || undefined,
            category: audit.category || 'performance',
            importance: audit.importance || 'medium'
          }));
        }
      } catch (parseError) {
        console.error("Error parsing audits data:", parseError);
        parsedAudits = [];
      }
    }
    
    // Transform the data to match the PageSpeedReport interface
    const report: PageSpeedReport = {
      id: data.id,
      created_at: data.created_at,
      metrics: {
        url: data.url || '',
        performance_score: data.performance_score || 0,
        accessibility_score: data.accessibility_score || 0,
        best_practices_score: data.best_practices_score || 0,
        seo_score: data.seo_score || 0,
        first_contentful_paint: data.first_contentful_paint || 0,
        speed_index: data.speed_index || 0,
        largest_contentful_paint: data.largest_contentful_paint || 0,
        time_to_interactive: data.time_to_interactive || 0,
        total_blocking_time: data.total_blocking_time || 0,
        cumulative_layout_shift: data.cumulative_layout_shift || 0
      },
      audits: parsedAudits
    };
    
    return report;
  } catch (error) {
    console.error("Exception fetching PageSpeed report:", error);
    return null;
  }
};

// Get historical PageSpeed metrics for a client (from the metrics table)
export const getPageSpeedHistory = async (clientId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('pagespeed_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching PageSpeed history:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception fetching PageSpeed history:", error);
    return [];
  }
};
