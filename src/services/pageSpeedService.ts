
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define interfaces for PageSpeed API responses
export interface PageSpeedMetrics {
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
  last_analyzed: string;
  url: string;
}

export interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  display_value?: string;
  category: 'performance' | 'accessibility' | 'best-practices' | 'seo';
}

export interface PageSpeedReport {
  metrics: PageSpeedMetrics;
  audits: PageSpeedAudit[];
  screenshot?: string;
}

// Function to analyze a URL using PageSpeed Insights API
export const analyzeWebsite = async (url: string): Promise<PageSpeedReport | null> => {
  try {
    // Basic URL validation
    if (!url) {
      toast.error("Por favor, introduce una URL válida");
      return null;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    console.log("Analyzing website:", url);
    
    // Use the provided API key
    const apiKey = "AIzaSyBKdlbD2EWHWcHKKHj0S_xL_wVYnCWraHM"; // Updated API key
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    toast.info("Analizando la web, esto puede tardar unos segundos...");
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("PageSpeed API error:", errorData);
      
      // More specific error messages based on the error type
      if (errorData.error && errorData.error.status === "INVALID_ARGUMENT") {
        if (errorData.error.message.includes("API key not valid")) {
          toast.error("Error de API: La clave de API no es válida. Por favor, contacta con el administrador.");
        } else {
          toast.error("Error de API: Argumento inválido. Verifica que la URL sea correcta.");
        }
      } else {
        toast.error("Error al analizar la web. Verifica la URL e inténtalo de nuevo.");
      }
      return null;
    }
    
    const data = await response.json();
    console.log("PageSpeed response:", data);
    
    // Extract metrics from the response
    const metrics: PageSpeedMetrics = {
      performance_score: Math.round(data.lighthouseResult.categories.performance.score * 100),
      accessibility_score: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
      best_practices_score: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
      seo_score: Math.round(data.lighthouseResult.categories.seo.score * 100),
      first_contentful_paint: data.lighthouseResult.audits['first-contentful-paint'].numericValue,
      speed_index: data.lighthouseResult.audits['speed-index'].numericValue,
      largest_contentful_paint: data.lighthouseResult.audits['largest-contentful-paint'].numericValue,
      time_to_interactive: data.lighthouseResult.audits['interactive'].numericValue,
      total_blocking_time: data.lighthouseResult.audits['total-blocking-time'].numericValue,
      cumulative_layout_shift: data.lighthouseResult.audits['cumulative-layout-shift'].numericValue,
      last_analyzed: new Date().toISOString(),
      url: url
    };
    
    // Extract important audits
    const audits: PageSpeedAudit[] = [];
    
    // Performance audits
    const performanceAudits = [
      'first-contentful-paint',
      'speed-index',
      'largest-contentful-paint',
      'interactive',
      'total-blocking-time',
      'cumulative-layout-shift',
      'render-blocking-resources',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'uses-responsive-images'
    ];
    
    // Accessibility audits
    const accessibilityAudits = [
      'color-contrast',
      'document-title',
      'html-has-lang',
      'image-alt',
      'meta-viewport'
    ];
    
    // Best practices audits
    const bestPracticesAudits = [
      'is-on-https',
      'no-document-write',
      'geolocation-on-start',
      'doctype',
      'errors-in-console'
    ];
    
    // SEO audits
    const seoAudits = [
      'viewport',
      'document-title',
      'meta-description',
      'link-text',
      'robots-txt',
      'canonical'
    ];
    
    // Process performance audits
    performanceAudits.forEach(id => {
      if (data.lighthouseResult.audits[id]) {
        audits.push({
          id,
          title: data.lighthouseResult.audits[id].title,
          description: data.lighthouseResult.audits[id].description,
          score: data.lighthouseResult.audits[id].score || 0,
          display_value: data.lighthouseResult.audits[id].displayValue,
          category: 'performance'
        });
      }
    });
    
    // Process accessibility audits
    accessibilityAudits.forEach(id => {
      if (data.lighthouseResult.audits[id]) {
        audits.push({
          id,
          title: data.lighthouseResult.audits[id].title,
          description: data.lighthouseResult.audits[id].description,
          score: data.lighthouseResult.audits[id].score || 0,
          display_value: data.lighthouseResult.audits[id].displayValue,
          category: 'accessibility'
        });
      }
    });
    
    // Process best practices audits
    bestPracticesAudits.forEach(id => {
      if (data.lighthouseResult.audits[id]) {
        audits.push({
          id,
          title: data.lighthouseResult.audits[id].title,
          description: data.lighthouseResult.audits[id].description,
          score: data.lighthouseResult.audits[id].score || 0,
          display_value: data.lighthouseResult.audits[id].displayValue,
          category: 'best-practices'
        });
      }
    });
    
    // Process SEO audits
    seoAudits.forEach(id => {
      if (data.lighthouseResult.audits[id]) {
        audits.push({
          id,
          title: data.lighthouseResult.audits[id].title,
          description: data.lighthouseResult.audits[id].description,
          score: data.lighthouseResult.audits[id].score || 0,
          display_value: data.lighthouseResult.audits[id].displayValue,
          category: 'seo'
        });
      }
    });
    
    // Get screenshot if available
    let screenshot = undefined;
    if (data.lighthouseResult.audits['final-screenshot']?.details?.data) {
      screenshot = data.lighthouseResult.audits['final-screenshot'].details.data;
    }
    
    toast.success("Análisis completado con éxito");
    
    return {
      metrics,
      audits,
      screenshot
    };
  } catch (error) {
    console.error("Error analyzing website:", error);
    toast.error("Error al analizar la web. Verifica la URL e inténtalo de nuevo.");
    return null;
  }
};

// Function to save PageSpeed data to Supabase
export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    console.log("Saving PageSpeed report to Supabase for client:", clientId);
    
    // Convert audits to JSON-compatible format before saving
    const auditData = JSON.stringify(report.audits);
    
    const { data, error } = await supabase
      .from('client_pagespeed')
      .insert({
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
        screenshot: report.screenshot,
        audits: auditData
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error saving PageSpeed report:", error);
      toast.error("Error al guardar el informe de PageSpeed");
      return false;
    }
    
    console.log("PageSpeed report saved successfully:", data);
    return true;
  } catch (error) {
    console.error("Error saving PageSpeed report:", error);
    toast.error("Error al guardar el informe de PageSpeed");
    return false;
  }
};

// Function to get latest PageSpeed report from Supabase
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
        console.log("No PageSpeed report found for client:", clientId);
        return null;
      }
      
      console.error("Error getting PageSpeed report:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Parse audits from JSON string back to object array
    let parsedAudits: PageSpeedAudit[] = [];
    if (data.audits) {
      try {
        // If it's already a string, parse it; otherwise stringify and parse it
        const auditStr = typeof data.audits === 'string' ? data.audits : JSON.stringify(data.audits);
        parsedAudits = JSON.parse(auditStr);
      } catch (e) {
        console.error("Error parsing audits:", e);
        parsedAudits = [];
      }
    }
    
    // Convert Supabase data to PageSpeedReport format
    const report: PageSpeedReport = {
      metrics: {
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
        last_analyzed: data.created_at,
        url: data.url
      },
      audits: parsedAudits,
      screenshot: data.screenshot
    };
    
    console.log("Retrieved PageSpeed report:", report);
    return report;
  } catch (error) {
    console.error("Error getting PageSpeed report:", error);
    return null;
  }
};

// Function to get PageSpeed history
export const getPageSpeedHistory = async (clientId: string): Promise<PageSpeedReport[]> => {
  try {
    const { data, error } = await supabase
      .from('client_pagespeed')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error("Error getting PageSpeed history:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Convert Supabase data to PageSpeedReport format
    const reports: PageSpeedReport[] = data.map(item => {
      // Parse audits from JSON
      let parsedAudits: PageSpeedAudit[] = [];
      if (item.audits) {
        try {
          // If it's already a string, parse it; otherwise stringify and parse it
          const auditStr = typeof item.audits === 'string' ? item.audits : JSON.stringify(item.audits);
          parsedAudits = JSON.parse(auditStr);
        } catch (e) {
          console.error("Error parsing audits:", e);
          parsedAudits = [];
        }
      }
      
      return {
        metrics: {
          performance_score: item.performance_score,
          accessibility_score: item.accessibility_score,
          best_practices_score: item.best_practices_score,
          seo_score: item.seo_score,
          first_contentful_paint: item.first_contentful_paint,
          speed_index: item.speed_index,
          largest_contentful_paint: item.largest_contentful_paint,
          time_to_interactive: item.time_to_interactive,
          total_blocking_time: item.total_blocking_time,
          cumulative_layout_shift: item.cumulative_layout_shift,
          last_analyzed: item.created_at,
          url: item.url
        },
        audits: parsedAudits,
        screenshot: item.screenshot
      };
    });
    
    return reports;
  } catch (error) {
    console.error("Error getting PageSpeed history:", error);
    return [];
  }
};
