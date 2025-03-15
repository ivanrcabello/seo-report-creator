
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
      title: item.title,
      date: item.date,
      businessName: item.business_name,
      address: item.address,
      location: item.location,
      phone: item.phone || '+34 91 XXX XX XX', // Ensure phone is never null
      website: item.website || 'www.example.com', // Ensure website is never null
      googleBusinessUrl: item.google_business_url,
      googleMapsRanking: item.google_maps_ranking,
      googleReviewsCount: item.google_reviews_count,
      keywordRankings: item.keyword_rankings,
      localListings: item.local_listings,
      shareToken: item.share_token,
      sharedAt: item.shared_at,
      recommendations: item.recommendations
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
        business_name: report.businessName,
        address: report.address,
        location: report.location,
        phone: report.phone,
        website: report.website,
        google_business_url: report.googleBusinessUrl,
        google_maps_ranking: report.googleMapsRanking,
        google_reviews_count: report.googleReviewsCount,
        keyword_rankings: report.keywordRankings,
        local_listings: report.localListings,
        share_token: report.shareToken,
        shared_at: report.sharedAt,
        recommendations: report.recommendations
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
