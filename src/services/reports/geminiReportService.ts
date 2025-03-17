
// DEPRECATED: This file is maintained for backward compatibility
// All functionality is now handled by openAIReportService.ts
// This file will be removed in future updates

import { generateOpenAIReport } from "./openAIReportGeneration";
import { saveReport } from "./reportStorage";

// Re-export necessary functions for backward compatibility
export { generateOpenAIReport as generateGeminiReport } from "./openAIReportGeneration";
export { saveReport } from "./reportStorage";

// Export the same function as in openAIReportService but with a deprecated notice
export const generateAndSaveReport = async () => {
  console.warn("generateAndSaveReport from geminiReportService is deprecated. Use generateAndSaveOpenAIReport instead.");
  return null;
};
