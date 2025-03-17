
// Re-export all report service functionality
export * from './reportMappers';
export * from './reportCrud';
export * from './reportSharing';
export * from './reportAI';
export * from './reportGeneration';
export * from './reportStorage';
export * from './openAIReportGeneration';
export * from './openAIReportService';

// Export Gemini for backward compatibility but mark as deprecated
export * from './geminiReportService';

