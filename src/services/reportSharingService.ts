
// This service handles report sharing functionality

/**
 * Generates a shareable URL for a report
 * @param reportId The ID of the report
 * @param shareToken The sharing token for the report
 * @returns The full URL that can be shared
 */
export const getSharedReportUrl = (reportId: string, shareToken: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/reports/share/${reportId}/${shareToken}`;
};

/**
 * Creates a sharing token for a report
 * @returns A unique token for sharing
 */
export const generateShareToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

