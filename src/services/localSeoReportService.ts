
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
      location: report.location,
      address: report.address || report.location, // Back-compatibility
      phone: report.phone || null,
      website: report.website || null,
      googleBusinessUrl: report.google_business_url || null,
      googleMapsRanking: report.google_maps_ranking || 0,
      googleReviewsCount: report.google_reviews_count || 0,
      keywordRankings: report.keyword_rankings ? (Array.isArray(report.keyword_rankings) ? report.keyword_rankings : []) : [],
      localListings: report.local_listings ? (Array.isArray(report.local_listings) ? report.local_listings : []) : [],
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
      location: data.location,
      address: data.address || data.location,
      phone: data.phone || null,
      website: data.website || null,
      googleBusinessUrl: data.google_business_url || null,
      googleMapsRanking: data.google_maps_ranking || 0,
      googleReviewsCount: data.google_reviews_count || 0,
      keywordRankings: data.keyword_rankings ? (Array.isArray(data.keyword_rankings) ? data.keyword_rankings : []) : [],
      localListings: data.local_listings ? (Array.isArray(data.local_listings) ? data.local_listings : []) : [],
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      recommendations: data.recommendations || []
    };
  } catch (error) {
    console.error('Error in getSeoLocalReportById:', error);
    return null;
  }
}
