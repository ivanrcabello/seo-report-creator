
// Re-export all types and functions from the separate module files
export * from "./types";
export * from "./pageSpeedApiService";
export * from "./pageSpeedDbService";

// Export the getPageSpeedHistory function
export const getPageSpeedHistory = async (clientId: string): Promise<any[]> => {
  try {
    console.log("Getting PageSpeed history for client:", clientId);
    const metrics = await getPageSpeedMetrics(clientId);
    return metrics.map(metric => ({
      id: metric.id,
      metrics: {
        url: metric.url,
        performance_score: metric.performance_score,
        accessibility_score: metric.accessibility_score,
        best_practices_score: metric.best_practices_score,
        seo_score: metric.seo_score,
        first_contentful_paint: metric.first_contentful_paint,
        speed_index: metric.speed_index,
        largest_contentful_paint: metric.largest_contentful_paint,
        time_to_interactive: metric.time_to_interactive,
        total_blocking_time: metric.total_blocking_time,
        cumulative_layout_shift: metric.cumulative_layout_shift
      },
      audits: [],
      created_at: metric.created_at
    }));
  } catch (error) {
    console.error("Error getting PageSpeed history:", error);
    return [];
  }
};

// Import the getPageSpeedMetrics from pageSpeedDbService
import { getPageSpeedMetrics } from "./pageSpeedDbService";
