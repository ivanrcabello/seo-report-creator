
/**
 * SEO Report PDF generation and handling
 * This file re-exports from smaller, focused modules to maintain the same public API
 */

// Re-export functions from their respective modules
export { generateSeoReportPdf } from './pdf/seoReportPdfCore';
export { downloadSeoReportPdf } from './pdf/seoReportPdfOperations';
