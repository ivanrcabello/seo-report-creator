
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Get local SEO settings for a client
 */
export async function getLocalSeoSettings(clientId: string) {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in getLocalSeoSettings:', clientId);
      return null;
    }

    console.log('Getting local SEO settings for client:', clientId);
    
    const { data, error } = await supabase
      .from('client_local_seo_settings')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching local SEO settings:', error);
      throw error;
    }
    
    console.log('Local SEO settings retrieved:', data);
    return data;
  } catch (error) {
    console.error('Error in getLocalSeoSettings:', error);
    return null;
  }
}

/**
 * Simple function to save basic local SEO settings
 */
export async function saveBasicLocalSeoSettings(clientId: string, data: {
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
}) {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in saveBasicLocalSeoSettings:', clientId);
      throw new Error('Client ID is required');
    }
    
    console.log('Saving basic local SEO settings for client:', clientId);
    console.log('Basic settings data:', data);
    
    // Format the data for direct insert/update instead of RPC
    const dataToSave = {
      client_id: clientId,
      business_name: data.businessName,
      address: data.address,
      phone: data.phone || null,
      website: data.website || null,
      google_business_url: data.googleBusinessUrl || null
    };
    
    // Check if record already exists
    const { data: existingRecord } = await supabase
      .from('client_local_seo_settings')
      .select('id')
      .eq('client_id', clientId)
      .maybeSingle();
    
    let result;
    
    if (existingRecord) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('client_local_seo_settings')
        .update(dataToSave)
        .eq('client_id', clientId)
        .select()
        .single();
      
      if (error) throw error;
      result = updatedData;
    } else {
      // Insert new record
      const { data: insertedData, error } = await supabase
        .from('client_local_seo_settings')
        .insert(dataToSave)
        .select()
        .single();
      
      if (error) throw error;
      result = insertedData;
    }
    
    console.log('Basic settings saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in saveBasicLocalSeoSettings:', error);
    toast.error('Error al guardar la configuración básica de SEO local');
    throw error;
  }
}

/**
 * Save local SEO settings for a client
 */
export async function saveLocalSeoSettings({
  id,
  clientId,
  businessName,
  address,
  phone,
  website,
  googleBusinessUrl,
  targetLocations,
  googleReviewsCount,
  googleReviewsAverage,
  listingsCount,
  googleMapsRanking,
}: {
  id?: string;
  clientId: string;
  businessName: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  googleBusinessUrl?: string | null;
  targetLocations?: string[];
  googleReviewsCount?: number;
  googleReviewsAverage?: number;
  listingsCount?: number;
  googleMapsRanking?: number;
}) {
  try {
    // Validate clientId
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in saveLocalSeoSettings:', clientId);
      throw new Error('Client ID is required');
    }
    
    console.log('Saving local SEO settings for client:', clientId);
    console.log('Settings data:', { id, clientId, businessName, address });
    
    // Normalize values to proper format
    const reviewsAvg = googleReviewsAverage != null ? Number(googleReviewsAverage) : null;
    const reviewsCount = googleReviewsCount != null ? Number(googleReviewsCount) : null;
    const listings = listingsCount != null ? Number(listingsCount) : null;
    const mapsRanking = googleMapsRanking != null ? Number(googleMapsRanking) : null;
    
    // Prepare data for direct insert/update
    const dataToSave = {
      business_name: businessName,
      address: address,
      phone: phone || null,
      website: website || null,
      google_business_url: googleBusinessUrl || null,
      target_locations: targetLocations || [],
      google_reviews_count: reviewsCount,
      google_reviews_average: reviewsAvg,
      listings_count: listings,
      google_maps_ranking: mapsRanking
    };
    
    console.log('Formatted data to save:', dataToSave);
    
    let result;
    
    // Check if record needs to be updated or inserted
    if (id) {
      // Update existing record by id
      const { data: updatedData, error } = await supabase
        .from('client_local_seo_settings')
        .update(dataToSave)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      result = updatedData;
    } else {
      // Check if there's an existing record for this client
      const { data: existingRecord } = await supabase
        .from('client_local_seo_settings')
        .select('id')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (existingRecord) {
        // Update by client_id
        const { data: updatedData, error } = await supabase
          .from('client_local_seo_settings')
          .update(dataToSave)
          .eq('client_id', clientId)
          .select()
          .single();
        
        if (error) throw error;
        result = updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error } = await supabase
          .from('client_local_seo_settings')
          .insert({
            client_id: clientId,
            ...dataToSave
          })
          .select()
          .single();
        
        if (error) throw error;
        result = insertedData;
      }
    }
    
    console.log('Settings saved successfully:', result);
    
    // Also save metrics history if any metrics data was provided
    if (googleMapsRanking != null || googleReviewsCount != null || 
        googleReviewsAverage != null || listingsCount != null) {
      
      try {
        const metricsResult = await saveMetricsHistory(clientId, {
          googleMapsRanking: mapsRanking,
          googleReviewsCount: reviewsCount, 
          googleReviewsAverage: reviewsAvg,
          listingsCount: listings
        });
        
        console.log('Metrics history saved:', metricsResult);
      } catch (metricsError) {
        console.error('Error saving metrics history:', metricsError);
        // Continue, don't throw error here so settings still save
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in saveLocalSeoSettings:', error);
    throw error;
  }
}

// Helper function to save metrics history
async function saveMetricsHistory(clientId: string, metrics: {
  googleMapsRanking?: number | null;
  googleReviewsCount?: number | null;
  googleReviewsAverage?: number | null;
  listingsCount?: number | null;
}) {
  const metricsData = {
    client_id: clientId,
    google_maps_ranking: metrics.googleMapsRanking,
    google_reviews_count: metrics.googleReviewsCount,
    google_reviews_average: metrics.googleReviewsAverage,
    listings_count: metrics.listingsCount,
    date: new Date().toISOString()
  };
  
  console.log('Saving metrics history:', metricsData);
  
  const { data, error } = await supabase
    .from('local_seo_metrics')
    .insert(metricsData)
    .select();
  
  if (error) {
    console.error('Error saving metrics history:', error);
    throw error;
  }
  
  return data;
}
