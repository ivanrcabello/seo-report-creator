
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
      first_contentful_paint: Math.round(report.metrics.first_contentful_paint),
      speed_index: Math.round(report.metrics.speed_index),
      largest_contentful_paint: Math.round(report.metrics.largest_contentful_paint),
      time_to_interactive: Math.round(report.metrics.time_to_interactive),
      total_blocking_time: Math.round(report.metrics.total_blocking_time),
      cumulative_layout_shift: parseFloat(report.metrics.cumulative_layout_shift.toString()),
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
    
    // Make the URL look clean for display
    const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    try {
      // Call the PageSpeed Insights API
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`PageSpeed API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("PageSpeed API response:", data);
      
      // Extract metrics from the API response
      const metrics: PageSpeedMetrics = {
        url: displayUrl,
        performance_score: data.lighthouseResult?.categories?.performance?.score || 0,
        accessibility_score: data.lighthouseResult?.categories?.accessibility?.score || 0,
        best_practices_score: data.lighthouseResult?.categories?.['best-practices']?.score || 0,
        seo_score: data.lighthouseResult?.categories?.seo?.score || 0,
        first_contentful_paint: data.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0,
        speed_index: data.lighthouseResult?.audits?.['speed-index']?.numericValue || 0,
        largest_contentful_paint: data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0,
        time_to_interactive: data.lighthouseResult?.audits?.['interactive']?.numericValue || 0,
        total_blocking_time: data.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0,
        cumulative_layout_shift: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0
      };
      
      // Extract audits from the API response
      const audits: PageSpeedAudit[] = [];
      
      // Categories to include in audits
      const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
      
      // Map to store audit importance by ID
      const auditImportance: Record<string, 'high' | 'medium' | 'low'> = {
        'first-contentful-paint': 'high',
        'speed-index': 'high',
        'largest-contentful-paint': 'high',
        'interactive': 'high',
        'total-blocking-time': 'high',
        'cumulative-layout-shift': 'high',
        // Add more mappings as needed
      };
      
      // Process all audits from the API response
      if (data.lighthouseResult?.audits) {
        for (const [id, auditData] of Object.entries(data.lighthouseResult.audits)) {
          // TypeScript safeguard - ensure auditData is an object
          const audit = auditData as Record<string, any>;
          
          // Skip informative audits with no score
          if (audit.scoreDisplayMode === 'informative' || audit.scoreDisplayMode === 'manual') {
            continue;
          }
          
          // Determine the category for this audit
          let category: 'performance' | 'accessibility' | 'best-practices' | 'seo' = 'performance';
          
          // Map audits to categories based on their ID patterns or other logic
          if (id.includes('a11y')) {
            category = 'accessibility';
          } else if (id.includes('seo')) {
            category = 'seo';
          } else if (id.includes('best-practices') || id.includes('uses-')) {
            category = 'best-practices';
          }
          
          // Create the audit object with proper type checking
          audits.push({
            id,
            title: audit.title || '',
            description: audit.description || '',
            score: typeof audit.score === 'number' ? audit.score : 0,
            scoreDisplayMode: audit.scoreDisplayMode || 'numeric',
            displayValue: audit.displayValue,
            category,
            importance: auditImportance[id] || 'medium'
          });
        }
      }
      
      const report: PageSpeedReport = {
        metrics,
        audits
      };
      
      toast.dismiss();
      console.log("PageSpeed analysis complete:", report);
      return report;
    } catch (apiError) {
      console.error("Error calling PageSpeed API:", apiError);
      
      // Fallback to mock data if API call fails
      toast.error("No se pudo conectar con la API de PageSpeed. Usando datos de ejemplo.");
      
      // Mock response data - use values between 0 and 1 for scores
      const mockReport: PageSpeedReport = {
        metrics: {
          url: displayUrl,
          performance_score: Math.random(),
          accessibility_score: Math.random(),
          best_practices_score: Math.random(),
          seo_score: Math.random(),
          first_contentful_paint: Math.round(Math.random() * 5000),
          speed_index: Math.round(Math.random() * 5000),
          largest_contentful_paint: Math.round(Math.random() * 6000),
          time_to_interactive: Math.round(Math.random() * 7000),
          total_blocking_time: Math.round(Math.random() * 500),
          cumulative_layout_shift: Math.random()
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
      return mockReport;
    }
  } catch (error) {
    toast.dismiss();
    console.error("Error analyzing website:", error);
    throw error;
  }
};
