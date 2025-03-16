
import { supabase } from '@/integrations/supabase/client';

/**
 * Get local SEO metrics history for a client
 */
export async function getLocalSeoMetricsHistory(clientId: string) {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in getLocalSeoMetricsHistory:', clientId);
      return [];
    }

    console.log('Getting local SEO metrics history for client:', clientId);
    
    const { data, error } = await supabase
      .from('local_seo_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching local SEO metrics history:', error);
      throw error;
    }
    
    console.log('Local SEO metrics history retrieved:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getLocalSeoMetricsHistory:', error);
    return [];
  }
}

/**
 * Save new local SEO metrics
 */
export async function saveLocalSeoMetrics(clientId: string, metrics: {
  googleMapsRanking?: number;
  googleReviewsCount?: number;
  googleReviewsAverage?: number;
  listingsCount?: number;
}) {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in saveLocalSeoMetrics:', clientId);
      throw new Error('Client ID is required');
    }

    console.log('Saving local SEO metrics for client:', clientId, 'Data:', metrics);
    
    // Ensure values are properly normalized to numbers or null
    const normalizedData = {
      client_id: clientId,
      google_maps_ranking: metrics.googleMapsRanking != null ? Number(metrics.googleMapsRanking) : null,
      google_reviews_count: metrics.googleReviewsCount != null ? Number(metrics.googleReviewsCount) : null,
      google_reviews_average: metrics.googleReviewsAverage != null ? Number(metrics.googleReviewsAverage) : null,
      listings_count: metrics.listingsCount != null ? Number(metrics.listingsCount) : null,
      date: new Date().toISOString()
    };
    
    console.log('Normalized data being sent to Supabase:', normalizedData);
    
    const { data, error } = await supabase
      .from('local_seo_metrics')
      .insert(normalizedData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving local SEO metrics:', error);
      throw error;
    }
    
    console.log('Local SEO metrics saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveLocalSeoMetrics:', error);
    return null;
  }
}
