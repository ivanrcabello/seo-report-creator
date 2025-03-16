
// This file is kept for backward compatibility - it re-exports everything from the new module
import { 
  PageSpeedMetrics, 
  PageSpeedAudit, 
  PageSpeedReport,
  getPageSpeedReport,
  savePageSpeedReport,
  getPageSpeedHistory,
  analyzeWebsite
} from "./pagespeed";

// Re-export all types and functions
export type { PageSpeedMetrics, PageSpeedAudit, PageSpeedReport };
export { getPageSpeedReport, savePageSpeedReport, getPageSpeedHistory, analyzeWebsite };
