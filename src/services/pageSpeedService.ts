
import { toast } from "sonner";

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
    
    // Use a different API key
    const apiKey = "AIzaSyBm8pyY98FUy9D3U3tTZn7WwHdJKM0Ggr4"; // Using a different demo key for PageSpeed Insights
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

// Function to save PageSpeed data to database (to be implemented with Supabase)
export const savePageSpeedReport = async (clientId: string, report: PageSpeedReport): Promise<boolean> => {
  try {
    // This would be implemented with Supabase in a production environment
    // For now, we'll just log the report and return success
    console.log("Saving PageSpeed report for client:", clientId, report);
    localStorage.setItem(`pagespeed_${clientId}`, JSON.stringify({
      ...report,
      timestamp: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error("Error saving PageSpeed report:", error);
    return false;
  }
};

// Function to get saved PageSpeed data from database
export const getPageSpeedReport = (clientId: string): PageSpeedReport | null => {
  try {
    const savedReport = localStorage.getItem(`pagespeed_${clientId}`);
    if (savedReport) {
      return JSON.parse(savedReport);
    }
    return null;
  } catch (error) {
    console.error("Error getting PageSpeed report:", error);
    return null;
  }
};
