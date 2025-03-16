
import { toast } from "sonner";
import { PageSpeedReport, PageSpeedMetrics, PageSpeedAudit } from "./types";

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
      const audits: PageSpeedAudit[] = parseAuditsFromApiResponse(data);
      
      const report: PageSpeedReport = {
        metrics,
        audits
      };
      
      toast.dismiss();
      console.log("PageSpeed analysis complete:", report);
      return report;
    } catch (apiError) {
      console.error("Error calling PageSpeed API:", apiError);
      return generateMockData(displayUrl);
    }
  } catch (error) {
    toast.dismiss();
    console.error("Error analyzing website:", error);
    throw error;
  }
};

// Helper function to parse audits from API response
const parseAuditsFromApiResponse = (data: any): PageSpeedAudit[] => {
  const audits: PageSpeedAudit[] = [];
  
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

  return audits;
};

// Generate mock data for testing or when API fails
const generateMockData = (displayUrl: string): PageSpeedReport => {
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
};
