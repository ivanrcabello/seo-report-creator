
import { supabase } from "@/integrations/supabase/client";
import { SeoLocalReport } from "@/types/client";

export const getSeoLocalReports = async (clientId: string): Promise<SeoLocalReport[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching local SEO reports:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      clientId: item.client_id,
      title: item.title || 'Informe SEO Local',
      date: item.date || new Date().toISOString(),
      businessName: item.business_name || '',
      address: item.address || '',
      location: item.location || '',
      phone: item.phone || '+34 91 XXX XX XX', // Default phone if not available
      website: item.website || 'www.example.com', // Default website if not available
      googleBusinessUrl: item.google_business_url || '',
      googleMapsRanking: item.google_maps_ranking || 0,
      googleReviewsCount: item.google_reviews_count || 0,
      keywordRankings: Array.isArray(item.keyword_rankings) 
        ? item.keyword_rankings 
        : typeof item.keyword_rankings === 'string'
          ? JSON.parse(item.keyword_rankings)
          : [],
      localListings: Array.isArray(item.local_listings) 
        ? item.local_listings 
        : typeof item.local_listings === 'string'
          ? JSON.parse(item.local_listings)
          : [],
      shareToken: item.share_token || null,
      sharedAt: item.shared_at || null,
      recommendations: Array.isArray(item.recommendations) ? item.recommendations : []
    }));
  } catch (error) {
    console.error("Error in getSeoLocalReports:", error);
    return [];
  }
};

export const createSeoLocalReport = async (report: Omit<SeoLocalReport, "id">): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('seo_local_reports')
      .insert({
        client_id: report.clientId,
        title: report.title || 'Informe SEO Local',
        date: report.date || new Date().toISOString(),
        business_name: report.businessName || '',
        address: report.address || '',
        location: report.location || '',
        phone: report.phone || '',
        website: report.website || '',
        google_business_url: report.googleBusinessUrl || '',
        google_maps_ranking: report.googleMapsRanking || 0,
        google_reviews_count: report.googleReviewsCount || 0,
        keyword_rankings: Array.isArray(report.keywordRankings) ? report.keywordRankings : [],
        local_listings: Array.isArray(report.localListings) ? report.localListings : [],
        share_token: report.shareToken || null,
        shared_at: report.sharedAt || null,
        recommendations: Array.isArray(report.recommendations) ? report.recommendations : []
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error creating local SEO report:", error);
      throw new Error(`Error al crear informe SEO local: ${error.message}`);
    }

    return data.id;
  } catch (error) {
    console.error("Exception in createSeoLocalReport:", error);
    throw error;
  }
};
