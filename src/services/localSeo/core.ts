
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
    
    // First check if a record already exists
    const { data: existingSettings } = await supabase
      .from('client_local_seo_settings')
      .select('id')
      .eq('client_id', clientId)
      .maybeSingle();
    
    let result;
    
    // Format the data for saving
    const dataToSave = {
      client_id: clientId,
      business_name: data.businessName,
      address: data.address,
      phone: data.phone || null,
      website: data.website || null,
      google_business_url: data.googleBusinessUrl || null
    };
    
    if (existingSettings?.id) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('client_local_seo_settings')
        .update(dataToSave)
        .eq('id', existingSettings.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating basic local SEO settings:', error);
        throw error;
      }
      result = updatedData;
    } else {
      // Insert new record
      const { data: newData, error } = await supabase
        .from('client_local_seo_settings')
        .insert(dataToSave)
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting basic local SEO settings:', error);
        throw error;
      }
      result = newData;
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
    
    // Only include fields that exist in the database table
    const dataToSave = {
      client_id: clientId,
      business_name: businessName,
      address: address,
      phone: phone || null,
      website: website || null,
      google_business_url: googleBusinessUrl || null,
      target_locations: targetLocations || [],
      google_reviews_count: googleReviewsCount || 0,
      google_reviews_average: normalizedReviewsAvg,
      listings_count: listingsCount || 0,
    };
    
    let result;
    
    if (id && id.trim() !== '') {
      // Update existing record
      console.log('Updating existing record with ID:', id);
      const { data, error } = await supabase
        .from('client_local_seo_settings')
        .update(dataToSave)
        .eq('id', id)
        .eq('client_id', clientId)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating local SEO settings:', error);
        throw error;
      }
      result = data;
    } else {
      // Insert new record
      console.log('Inserting new record for client:', clientId);
      const { data, error } = await supabase
        .from('client_local_seo_settings')
        .insert(dataToSave)
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting local SEO settings:', error);
        throw error;
      }
      result = data;
    }
    
    console.log('Settings saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in saveLocalSeoSettings:', error);
    throw error;
  }
}
