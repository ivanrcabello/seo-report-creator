
// This file is maintained for backward compatibility but Gemini is no longer in use
// All functionality is now handled by OpenAI services
// TODO: Remove this file in future updates

export { 
  generateAndSaveOpenAIReport as generateAndSaveGeminiReport,
} from "./reports/openAIReportService";

// For backward compatibility
export const generateGeminiReport = () => {
  console.warn("Gemini is deprecated, using OpenAI instead");
  return null;
};

export const saveGeminiReport = () => {
  console.warn("Gemini is deprecated, using OpenAI instead");
  return { success: false, error: "Gemini is deprecated" };
};
