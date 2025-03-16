
import { supabase } from '@/integrations/supabase/client';
import { SeoLocalReport } from '@/types/client';

/**
 * Get local SEO reports for a client
 */
export async function getLocalSeoReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in getLocalSeoReports:', clientId);
      return [];
    }

    console.log('Getting local SEO reports for client:', clientId);
    
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching local SEO reports:', error);
      throw error;
    }
    
    console.log('Local SEO reports retrieved:', data);
    
    // Transform the data from snake_case to camelCase to match our TypeScript types
    const transformedData: SeoLocalReport[] = data?.map(report => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      businessName: report.business_name,
      location: report.location,
      address: report.business_name, // Assuming address is the business name if not present
      phone: report.phone,
      website: report.website,
      googleBusinessUrl: report.google_business_url,
      googleMapsRanking: report.google_maps_ranking,
      googleReviewsCount: report.google_reviews_count,
      googleReviewsAverage: report.google_reviews_average,
      keywordRankings: report.keyword_rankings,
      localListings: report.local_listings,
      shareToken: report.share_token,
      sharedAt: report.shared_at,
      recommendations: report.recommendations,
    })) || [];
    
    return transformedData;
  } catch (error) {
    console.error('Error in getLocalSeoReports:', error);
    return [];
  }
}

/**
 * Save local SEO report
 */
export async function saveLocalSeoReport(report: SeoLocalReport): Promise<SeoLocalReport | null> {
  try {
    if (!report.clientId || typeof report.clientId !== 'string' || report.clientId.trim() === '') {
      console.error('Invalid clientId in saveLocalSeoReport:', report.clientId);
      throw new Error('Client ID is required');
    }

    console.log('Saving local SEO report for client:', report.clientId);
    
    // Transform from camelCase to snake_case for the database
    const dbReport = {
      id: report.id,
      client_id: report.clientId,
      title: report.title,
      date: report.date,
      business_name: report.businessName,
      location: report.location || null,
      address: report.address,
      phone: report.phone,
      website: report.website,
      google_business_url: report.googleBusinessUrl,
      google_maps_ranking: report.googleMapsRanking,
      google_reviews_count: report.googleReviewsCount,
      google_reviews_average: report.googleReviewsAverage,
      keyword_rankings: report.keywordRankings,
      local_listings: report.localListings,
      share_token: report.shareToken,
      shared_at: report.sharedAt,
      recommendations: report.recommendations,
    };
    
    const { data, error } = await supabase
      .from('seo_local_reports')
      .upsert(dbReport)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving local SEO report:', error);
      throw error;
    }
    
    console.log('Local SEO report saved:', data);
    
    // Transform back to camelCase for the return type
    const savedReport: SeoLocalReport = {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      businessName: data.business_name,
      location: data.location,
      address: data.business_name, // Assuming address is business_name if missing
      phone: data.phone,
      website: data.website,
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking,
      googleReviewsCount: data.google_reviews_count,
      googleReviewsAverage: data.google_reviews_average,
      keywordRankings: data.keyword_rankings,
      localListings: data.local_listings,
      shareToken: data.share_token,
      sharedAt: data.shared_at,
      recommendations: data.recommendations,
    };
    
    return savedReport;
  } catch (error) {
    console.error('Error in saveLocalSeoReport:', error);
    return null;
  }
}
