
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
      console.log("PageSpeed API response received");
      
      // Extract metrics from the API response
      const metrics: PageSpeedMetrics = {
        url: displayUrl,
        performance_score: parseFloat(data.lighthouseResult?.categories?.performance?.score || 0),
        accessibility_score: parseFloat(data.lighthouseResult?.categories?.accessibility?.score || 0),
        best_practices_score: parseFloat(data.lighthouseResult?.categories?.['best-practices']?.score || 0),
        seo_score: parseFloat(data.lighthouseResult?.categories?.seo?.score || 0),
        first_contentful_paint: parseFloat(data.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0),
        speed_index: parseFloat(data.lighthouseResult?.audits?.['speed-index']?.numericValue || 0),
        largest_contentful_paint: parseFloat(data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0),
        time_to_interactive: parseFloat(data.lighthouseResult?.audits?.['interactive']?.numericValue || 0),
        total_blocking_time: parseFloat(data.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0),
        cumulative_layout_shift: parseFloat(data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0)
      };
      
      // Extract audits from the API response
      const audits: PageSpeedAudit[] = parseAuditsFromApiResponse(data);
      
      const report: PageSpeedReport = {
        metrics,
        audits
      };
      
      toast.dismiss();
      console.log("PageSpeed analysis complete");
      return report;
    } catch (apiError) {
      console.error("Error calling PageSpeed API:", apiError);
      toast.error("Error al conectar con PageSpeed API. Usando datos de ejemplo.");
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
      if (audit.scoreDisplayMode === 'informative' || audit.scoreDisplayMode === 'manual' || audit.scoreDisplayMode === 'notApplicable') {
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
      
      // Handle binary-scored audits (passed/failed)
      let score = typeof audit.score === 'number' ? audit.score : 0;
      if (audit.scoreDisplayMode === 'binary') {
        score = score > 0 ? 1 : 0;
      }
      
      // Create the audit object with proper type checking
      audits.push({
        id,
        title: audit.title || '',
        description: audit.description || '',
        score: score,
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
  // Mock response data - use values between 0 and 1 for scores
  const mockReport: PageSpeedReport = {
    metrics: {
      url: displayUrl,
      performance_score: Math.random() * 0.8 + 0.1, // 0.1 - 0.9
      accessibility_score: Math.random() * 0.8 + 0.1,
      best_practices_score: Math.random() * 0.8 + 0.1,
      seo_score: Math.random() * 0.8 + 0.1,
      first_contentful_paint: Math.round(Math.random() * 5000),
      speed_index: Math.round(Math.random() * 5000),
      largest_contentful_paint: Math.round(Math.random() * 6000),
      time_to_interactive: Math.round(Math.random() * 7000),
      total_blocking_time: Math.round(Math.random() * 500),
      cumulative_layout_shift: Math.random() * 0.5
    },
    audits: []
  };
  
  // Generate some audits for each category
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
  const importanceLevels = ['high', 'medium', 'low'] as const;
  
  categories.forEach(category => {
    // Add 3-5 more audits per category
    const numAudits = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numAudits; i++) {
      // Create varied scores for better test data
      const score = Math.random(); // 0-1
      
      mockReport.audits.push({
        id: `${category}-audit-${i}`,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Audit ${i+1}`,
        description: `This is a mock ${category} audit for testing purposes.`,
        score: score,
        scoreDisplayMode: 'numeric',
        category,
        importance: importanceLevels[Math.floor(Math.random() * importanceLevels.length)]
      });
    }
  });
  
  // Add key performance audits that mimic the real API
  mockReport.audits.push({
    id: 'first-contentful-paint',
    title: 'First Contentful Paint',
    description: 'First Contentful Paint marks the time at which the first text or image is painted.',
    score: Math.random(),
    scoreDisplayMode: 'numeric',
    displayValue: Math.round(Math.random() * 5) + ' s',
    category: 'performance',
    importance: 'high'
  });
  
  mockReport.audits.push({
    id: 'largest-contentful-paint',
    title: 'Largest Contentful Paint',
    description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.',
    score: Math.random(),
    scoreDisplayMode: 'numeric',
    displayValue: Math.round(Math.random() * 6) + ' s',
    category: 'performance',
    importance: 'high'
  });
  
  mockReport.audits.push({
    id: 'cumulative-layout-shift',
    title: 'Cumulative Layout Shift',
    description: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.',
    score: Math.random(),
    scoreDisplayMode: 'numeric',
    displayValue: (Math.random() * 0.5).toFixed(2),
    category: 'performance',
    importance: 'high'
  });
  
  return mockReport;
};
