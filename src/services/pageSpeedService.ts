
import { supabase } from "@/integrations/supabase/client";
import { savePageSpeedMetrics } from "./pageSpeedMetricsService";
import { toast } from "sonner";

export interface PageSpeedMetrics {
  url: string;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  first_contentful_paint: number;
  speed_index: number;
  largest_contentful_paint: number;
  time_to_interactive: number;
  total_blocking_time: number;
  cumulative_layout_shift: number;
}

export interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  scoreDisplayMode: string;
  displayValue?: string;
  category: 'performance' | 'accessibility' | 'best-practices' | 'seo';
  importance: 'high' | 'medium' | 'low';
}

export interface PageSpeedReport {
  id?: string;
  metrics: PageSpeedMetrics;
  audits: PageSpeedAudit[];
  created_at?: string;
}

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
      .single();
    
    if (error) {
      console.error("Error fetching PageSpeed report:", error);
      return null;
    }
    
    console.log("PageSpeed report retrieved:", data);
    
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
      audits: data.audits as PageSpeedAudit[] || []
    };
    
    return report;
  } catch (error) {
    console.error("Exception fetching PageSpeed report:", error);
    return null;
  }
};

// Save a PageSpeed report for a client
export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    console.log("Saving PageSpeed report for client:", clientId);
    
    const reportData = {
      client_id: clientId,
      url: report.metrics.url,
      performance_score: report.metrics.performance_score,
      accessibility_score: report.metrics.accessibility_score,
      best_practices_score: report.metrics.best_practices_score,
      seo_score: report.metrics.seo_score,
      first_contentful_paint: report.metrics.first_contentful_paint,
      speed_index: report.metrics.speed_index,
      largest_contentful_paint: report.metrics.largest_contentful_paint,
      time_to_interactive: report.metrics.time_to_interactive,
      total_blocking_time: report.metrics.total_blocking_time,
      cumulative_layout_shift: report.metrics.cumulative_layout_shift,
      audits: report.audits
    };
    
    // First save to client_pagespeed table
    const { data, error } = await supabase
      .from('client_pagespeed')
      .insert([reportData])
      .select()
      .single();
    
    if (error) {
      console.error("Error saving PageSpeed report:", error);
      return false;
    }
    
    console.log("PageSpeed report saved:", data);
    
    // Then save metrics to the metrics tracking table
    await savePageSpeedMetrics(clientId, report);
    
    return true;
  } catch (error) {
    console.error("Exception saving PageSpeed report:", error);
    return false;
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

// Analyze a website URL with PageSpeed Insights API
export const analyzeWebsite = async (url: string): Promise<PageSpeedReport | null> => {
  try {
    toast.loading("Analizando URL con PageSpeed Insights...");
    console.log("Analyzing URL with PageSpeed Insights:", url);
    
    // Here we'd normally call the PageSpeed Insights API
    // For now, we'll use mock data for testing
    
    // Make the URL look clean for display
    const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Mock response data
    const mockReport: PageSpeedReport = {
      metrics: {
        url: displayUrl,
        performance_score: Math.round(Math.random() * 100) / 100,
        accessibility_score: Math.round(Math.random() * 100) / 100,
        best_practices_score: Math.round(Math.random() * 100) / 100,
        seo_score: Math.round(Math.random() * 100) / 100,
        first_contentful_paint: Math.round(Math.random() * 5000),
        speed_index: Math.round(Math.random() * 5000),
        largest_contentful_paint: Math.round(Math.random() * 6000),
        time_to_interactive: Math.round(Math.random() * 7000),
        total_blocking_time: Math.round(Math.random() * 500),
        cumulative_layout_shift: Math.round(Math.random() * 100) / 100
      },
      audits: [
        {
          id: 'first-contentful-paint',
          title: 'First Contentful Paint',
          description: 'First Contentful Paint marks the time at which the first text or image is painted.',
          score: Math.random(),
          scoreDisplayMode: 'numeric',
          displayValue: Math.round(Math.random() * 5) + ' s',
          category: 'performance',
          importance: 'high'
        },
        {
          id: 'speed-index',
          title: 'Speed Index',
          description: 'Speed Index shows how quickly the contents of a page are visibly populated.',
          score: Math.random(),
          scoreDisplayMode: 'numeric',
          displayValue: Math.round(Math.random() * 5) + ' s',
          category: 'performance',
          importance: 'high'
        },
        {
          id: 'largest-contentful-paint',
          title: 'Largest Contentful Paint',
          description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.',
          score: Math.random(),
          scoreDisplayMode: 'numeric',
          displayValue: Math.round(Math.random() * 6) + ' s',
          category: 'performance',
          importance: 'high'
        }
      ]
    };
    
    // Generate some audits for each category
    const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
    const importanceLevels = ['high', 'medium', 'low'] as const;
    
    categories.forEach(category => {
      // Add 3-5 more audits per category
      const numAudits = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numAudits; i++) {
        mockReport.audits.push({
          id: `${category}-audit-${i}`,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Audit ${i+1}`,
          description: `This is a mock ${category} audit for testing purposes.`,
          score: Math.random(),
          scoreDisplayMode: 'numeric',
          category,
          importance: importanceLevels[Math.floor(Math.random() * importanceLevels.length)]
        });
      }
    });
    
    toast.dismiss();
    console.log("PageSpeed analysis complete:", mockReport);
    return mockReport;
  } catch (error) {
    toast.dismiss();
    console.error("Error analyzing website:", error);
    throw error;
  }
};
