
import { SeoLocalReport } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Función para convertir datos de Supabase al formato de la aplicación
const mapLocalSeoReportFromDB = (report: any): SeoLocalReport => ({
  id: report.id,
  clientId: report.client_id,
  title: report.title,
  date: report.date,
  businessName: report.business_name,
  location: report.location,
  googleMapsRanking: report.google_maps_ranking,
  localListings: report.local_listings,
  keywordRankings: report.keyword_rankings,
  recommendations: report.recommendations,
  shareToken: report.share_token,
  sharedAt: report.shared_at
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapLocalSeoReportToDB = (report: Partial<SeoLocalReport>) => ({
  client_id: report.clientId,
  title: report.title,
  date: report.date,
  business_name: report.businessName,
  location: report.location,
  google_maps_ranking: report.googleMapsRanking,
  local_listings: report.localListings as Json,
  keyword_rankings: report.keywordRankings as Json,
  recommendations: report.recommendations,
  share_token: report.shareToken,
  shared_at: report.sharedAt
});

// Local SEO report operations
export const getLocalSeoReports = async (clientId: string): Promise<SeoLocalReport[]> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .select('*')
    .eq('client_id', clientId);
  
  if (error) {
    console.error("Error fetching local SEO reports:", error);
    return [];
  }
  
  return (data || []).map(mapLocalSeoReportFromDB);
};

export const getLocalSeoReport = async (id: string): Promise<SeoLocalReport | undefined> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching local SEO report:", error);
    return undefined;
  }
  
  return data ? mapLocalSeoReportFromDB(data) : undefined;
};

export const addLocalSeoReport = async (report: Omit<SeoLocalReport, "id">): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .insert([mapLocalSeoReportToDB(report)])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding local SEO report:", error);
    throw error;
  }
  
  // Update client's lastReport date
  await supabase
    .from('clients')
    .update({ last_report: report.date })
    .eq('id', report.clientId);
  
  return mapLocalSeoReportFromDB(data);
};

export const updateLocalSeoReport = async (report: SeoLocalReport): Promise<SeoLocalReport> => {
  const { data, error } = await supabase
    .from('seo_local_reports')
    .update(mapLocalSeoReportToDB(report))
    .eq('id', report.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating local SEO report:", error);
    throw error;
  }
  
  return mapLocalSeoReportFromDB(data);
};

export const deleteLocalSeoReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('seo_local_reports')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting local SEO report:", error);
    throw error;
  }
};
