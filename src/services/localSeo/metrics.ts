
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
      .order('date', { ascending: false })
      .limit(10);
    
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
 * Save local SEO metrics for a client
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

    console.log('Saving local SEO metrics for client:', clientId);
    console.log('Metrics data:', metrics);

    // Ensure numeric values and provide defaults
    const googleMapsRanking = typeof metrics.googleMapsRanking === 'number' ? metrics.googleMapsRanking : 0;
    const googleReviewsCount = typeof metrics.googleReviewsCount === 'number' ? metrics.googleReviewsCount : 0;
    const googleReviewsAverage = typeof metrics.googleReviewsAverage === 'number' ? 
      metrics.googleReviewsAverage : (parseFloat(String(metrics.googleReviewsAverage)) || 0);
    const listingsCount = typeof metrics.listingsCount === 'number' ? metrics.listingsCount : 0;

    const dataToSave = {
      client_id: clientId,
      google_maps_ranking: googleMapsRanking,
      google_reviews_count: googleReviewsCount,
      google_reviews_average: googleReviewsAverage,
      listings_count: listingsCount,
      date: new Date().toISOString(),
    };

    console.log('Final metrics data to save:', dataToSave);

    const { data, error } = await supabase
      .from('local_seo_metrics')
      .insert(dataToSave)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving local SEO metrics:', error);
      throw error;
    }
    
    console.log('Metrics saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveLocalSeoMetrics:', error);
    throw error;
  }
}
