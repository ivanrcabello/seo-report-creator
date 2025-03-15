
import { supabase } from '@/integrations/supabase/client';
import { SeoLocalReport } from '@/types/client';

/**
 * Fetches all local SEO reports for a specific client
 */
export async function getSeoLocalReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching SEO local reports:', error);
      throw new Error('Failed to fetch SEO local reports');
    }

    // Map the database structure to our application model
    return data.map(report => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      businessName: report.business_name,
      address: report.address || report.location, // Back-compatibility
      location: report.location,
      phone: report.phone,
      website: report.website,
      googleBusinessUrl: report.google_business_url,
      googleMapsRanking: report.google_maps_ranking,
      googleReviewsCount: report.google_reviews_count,
      keywordRankings: report.keyword_rankings,
      localListings: report.local_listings,
      shareToken: report.share_token,
      sharedAt: report.shared_at,
      recommendations: report.recommendations || []
    }));
  } catch (error) {
    console.error('Error in getSeoLocalReports:', error);
    return [];
  }
}

/**
 * Fetch a specific SEO local report by ID
 */
export async function getSeoLocalReportById(reportId: string): Promise<SeoLocalReport | null> {
  try {
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Error fetching SEO local report:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      businessName: data.business_name,
      address: data.address || data.location,
      location: data.location,
      phone: data.phone,
      website: data.website,
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking,
      googleReviewsCount: data.google_reviews_count,
      keywordRankings: data.keyword_rankings,
      localListings: data.local_listings,
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      recommendations: data.recommendations || []
    };
  } catch (error) {
    console.error('Error in getSeoLocalReportById:', error);
    return null;
  }
}
