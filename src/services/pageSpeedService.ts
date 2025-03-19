
// This file is kept for backward compatibility - it re-exports everything from the new module
import { 
  PageSpeedMetrics, 
  PageSpeedAuditItem, 
  PageSpeedReport,
  getPageSpeedReport,
  savePageSpeedReport,
  getPageSpeedHistory,
  analyzeWebsite
} from "./pagespeed";

// Re-export all types and functions
export type { PageSpeedMetrics, PageSpeedAuditItem, PageSpeedReport };
export type { PageSpeedAuditItem as PageSpeedAudit }; // Alias for compatibility
export { getPageSpeedReport, savePageSpeedReport, getPageSpeedHistory, analyzeWebsite };
