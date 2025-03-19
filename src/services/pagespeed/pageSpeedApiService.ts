
import axios from 'axios';
import { PageSpeedReport, PageSpeedMetrics, PageSpeedAuditItem } from "./types";

// Use a hardcoded API key instead of environment variable
const API_KEY = "AIzaSyBKdlbD2EWHWcHKKHj0S_xL_wVYnCWraHM";

export const analyzeWebsite = async (url: string): Promise<PageSpeedReport> => {
  try {
    console.log("Analyzing URL with PageSpeed Insights:", url);
    
    // Always try to use the API since we have a key
    // Construct the API URL
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile&category=performance&category=seo&category=best-practices&category=accessibility`;
    
    console.log("Calling PageSpeed API...");
    
    // Make the request to the API
    const response = await axios.get(apiUrl);
    
    if (response.status !== 200) {
      console.error("PageSpeed API responded with status:", response.status);
      throw new Error(`PageSpeed API responded with status: ${response.status}`);
    }
    
    const data = response.data;
    console.log("PageSpeed API response received successfully");
    
    // Process and map the data from the response
    return processPageSpeedResponse(data, url);
  } catch (error) {
    console.error("Error calling PageSpeed API:", error);
    
    // Only use mock data if we encounter an error or in development
    if (import.meta.env.DEV) {
      console.log("Falling back to mock data in development");
      return generateMockData(url);
    }
    
    throw error;
  }
};

// Function to process the response from the API
const processPageSpeedResponse = (data: any, url: string): PageSpeedReport => {
  try {
    // Extract categories and audits
    const categories = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};
    
    // Extract scores from categories
    const performanceScore = (categories.performance?.score || 0);
    const seoScore = (categories.seo?.score || 0);
    const bestPracticesScore = (categories['best-practices']?.score || 0);
    const accessibilityScore = (categories.accessibility?.score || 0);
    
    // Extract main metrics
    const firstContentfulPaint = parseFloat(audits['first-contentful-paint']?.numericValue) || 0;
    const speedIndex = parseFloat(audits['speed-index']?.numericValue) || 0;
    const largestContentfulPaint = parseFloat(audits['largest-contentful-paint']?.numericValue) || 0;
    const timeToInteractive = parseFloat(audits['interactive']?.numericValue) || 0;
    const totalBlockingTime = parseFloat(audits['total-blocking-time']?.numericValue) || 0;
    const cumulativeLayoutShift = parseFloat(audits['cumulative-layout-shift']?.numericValue) || 0;
    
    // Convert audits to the required format
    const formattedAudits: PageSpeedAuditItem[] = Object.entries(audits).map(([id, audit]: [string, any]) => {
      // Ensure score is a number between 0 and 1
      let score = typeof audit.score === 'number' ? audit.score : null;
      
      // Try to infer score from displayValue if necessary
      if (score === null && audit.displayValue) {
        const numericMatch = audit.displayValue.match(/(\d+(\.\d+)?)/);
        if (numericMatch) {
          const numericValue = parseFloat(numericMatch[0]);
          if (numericValue <= 1) {
            score = numericValue;
          } else if (numericValue <= 100) {
            score = numericValue / 100;
          }
        }
      }
      
      // Default value if score is still null
      if (score === null) {
        score = 0.5;
      }
      
      // Determine category of the audit
      let category: 'performance' | 'accessibility' | 'best-practices' | 'seo' = 'performance';
      if (audit.group === 'a11y') {
        category = 'accessibility';
      } else if (audit.group === 'best-practices') {
        category = 'best-practices';
      } else if (audit.group === 'seo') {
        category = 'seo';
      }
      
      // Determine importance based on score
      let importance: 'high' | 'medium' | 'low' = 'medium';
      if (score < 0.5) {
        importance = 'high';
      } else if (score >= 0.9) {
        importance = 'low';
      }
      
      return {
        id,
        title: audit.title || id,
        description: audit.description || '',
        score,
        scoreDisplayMode: audit.scoreDisplayMode || 'numeric',
        displayValue: audit.displayValue || '',
        category,
        importance,
        details: audit.details || null
      };
    });
    
    // Create metrics with timestamp
    const metrics: PageSpeedMetrics = {
      url,
      performance_score: performanceScore,
      seo_score: seoScore,
      best_practices_score: bestPracticesScore,
      accessibility_score: accessibilityScore,
      first_contentful_paint: firstContentfulPaint,
      speed_index: speedIndex,
      largest_contentful_paint: largestContentfulPaint,
      time_to_interactive: timeToInteractive,
      total_blocking_time: totalBlockingTime,
      cumulative_layout_shift: cumulativeLayoutShift,
      timestamp: new Date().toISOString()
    };
    
    // Return the complete report
    return {
      id: `pagespeed-${Date.now()}`,
      metrics,
      auditItems: formattedAudits,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error processing PageSpeed response:", error);
    throw new Error("Could not process PageSpeed API response");
  }
};

// Function to generate mock data for development
const generateMockData = (url: string): PageSpeedReport => {
  console.log("Generating mock PageSpeed data for:", url);
  
  // Generate random audits
  const audits: PageSpeedAuditItem[] = [];
  const categories: Array<'performance' | 'accessibility' | 'best-practices' | 'seo'> = [
    'performance', 'accessibility', 'best-practices', 'seo'
  ];
  
  // Generate some random audits
  for (let i = 1; i <= 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const score = Math.random();
    
    audits.push({
      id: `mock-audit-${i}`,
      title: `Mock audit ${i}`,
      description: `This is a mock description for audit ${i}`,
      score,
      scoreDisplayMode: 'numeric',
      displayValue: score >= 0.9 ? 'Good' : score >= 0.5 ? 'Needs improvement' : 'Poor',
      category,
      importance: score < 0.5 ? 'high' : score >= 0.9 ? 'low' : 'medium'
    });
  }
  
  // Generate random scores between 0 and 1
  const performanceScore = parseFloat(Math.random().toFixed(2));
  const seoScore = parseFloat(Math.random().toFixed(2));
  const bestPracticesScore = parseFloat(Math.random().toFixed(2));
  const accessibilityScore = parseFloat(Math.random().toFixed(2));
  
  // Create the metrics object with timestamp
  const metrics: PageSpeedMetrics = {
    url,
    performance_score: performanceScore,
    seo_score: seoScore,
    best_practices_score: bestPracticesScore,
    accessibility_score: accessibilityScore,
    first_contentful_paint: Math.round(Math.random() * 5000),
    speed_index: Math.round(Math.random() * 6000),
    largest_contentful_paint: Math.round(Math.random() * 7000),
    time_to_interactive: Math.round(Math.random() * 8000),
    total_blocking_time: Math.round(Math.random() * 1000),
    cumulative_layout_shift: parseFloat((Math.random() * 0.5).toFixed(2)),
    timestamp: new Date().toISOString()
  };
  
  return {
    id: `mock-pagespeed-${Date.now()}`,
    metrics,
    auditItems: audits,
    created_at: new Date().toISOString()
  };
};
