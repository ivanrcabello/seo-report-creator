
import { ClientReport } from "@/types/client";

/**
 * Maps database report data to ClientReport format
 */
export const mapDbReportToClientReport = (data: any): ClientReport => {
  console.log("Mapping DB report to ClientReport:", data?.id || "unknown id");
  
  return {
    id: data.id,
    clientId: data.client_id,
    title: data.title,
    date: data.date,
    type: data.type,
    content: data.content || "",
    url: data.url || "",
    notes: data.notes || "",
    documentIds: data.document_ids || [],
    shareToken: data.share_token,
    sharedAt: data.shared_at,
    includeInProposal: data.include_in_proposal || false,
    analyticsData: data.analytics_data || {},
    status: (data.status as 'draft' | 'published' | 'shared') || 'draft'
  };
};
