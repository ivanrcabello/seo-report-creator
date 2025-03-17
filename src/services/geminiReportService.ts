
// This file is maintained for backward compatibility but Gemini is no longer in use
// All functionality is now handled by OpenAI services
// TODO: Remove this file in future updates

import { 
  generateAndSaveOpenAIReport,
  generateOpenAIReport
} from "./reports/openAIReportService";

// Re-export with renamed functions for backward compatibility
export { generateAndSaveOpenAIReport as generateAndSaveGeminiReport } from "./reports/openAIReportService";
export { generateOpenAIReport as generateGeminiReport } from "./reports/openAIReportGeneration";

// For backward compatibility
export const saveGeminiReport = () => {
  console.warn("Gemini is deprecated, using OpenAI instead");
  return { success: false, error: "Gemini is deprecated, use saveReport from reportStorage instead" };
};
