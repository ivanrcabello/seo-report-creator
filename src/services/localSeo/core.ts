
import { supabase } from '@/integrations/supabase/client';
import { SeoLocalReport } from '@/types/client';
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
    
    // Format the data for saving via RPC function
    const dataToSave = {
      client_id: clientId,
      business_name: data.businessName,
      address: data.address,
      phone: data.phone || null,
      website: data.website || null,
      google_business_url: data.googleBusinessUrl || null
    };
    
    // Call a stored procedure or RPC function instead of direct insert
    const { data: result, error } = await supabase
      .rpc('upsert_local_seo_settings', dataToSave);
        
    if (error) {
      console.error('Error updating basic local SEO settings:', error);
      throw error;
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
    
    // Convert googleReviewsAverage to a valid number
    const normalizedReviewsAvg = typeof googleReviewsAverage === 'number' ? 
      googleReviewsAverage : 
      (parseFloat(String(googleReviewsAverage)) || 0);
    
    // Prepare data for RPC call
    const dataToSave = {
      p_id: id || null,
      p_client_id: clientId,
      p_business_name: businessName,
      p_address: address,
      p_phone: phone || null,
      p_website: website || null,
      p_google_business_url: googleBusinessUrl || null,
      p_target_locations: targetLocations || [],
      p_google_reviews_count: googleReviewsCount || 0,
      p_google_reviews_average: normalizedReviewsAvg,
      p_listings_count: listingsCount || 0,
      p_google_maps_ranking: googleMapsRanking || 0
    };
    
    console.log('Final settings data to save via RPC:', dataToSave);
    
    // Call RPC function to save data
    const { data: result, error } = await supabase
      .rpc('upsert_complete_local_seo_settings', dataToSave);
    
    if (error) {
      console.error('Error saving local SEO settings:', error);
      throw error;
    }
    
    console.log('Settings saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in saveLocalSeoSettings:', error);
    throw error;
  }
}
