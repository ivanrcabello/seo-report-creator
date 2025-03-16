
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SeoLocalReport } from '@/types/client';
import { toast } from 'sonner';

/**
 * AI-generated local SEO analysis mock
 */
export async function generateLocalSeoAnalysis(clientId: string, businessName: string, location: string) {
  const reportId = uuidv4();
  const googleMapsRanking = Math.floor(Math.random() * 20) + 1; // Random ranking between 1 and 20
  const googleReviewsCount = Math.floor(Math.random() * 100); // Random number of reviews
  const keywordRankings = [
    { keyword: `best ${businessName} in ${location}`, position: Math.floor(Math.random() * 15) },
    { keyword: `${businessName} services ${location}`, position: Math.floor(Math.random() * 10) },
    { keyword: `top ${businessName} ${location}`, position: Math.floor(Math.random() * 5) }
  ];
  const recommendations = [
    "Optimize Google My Business profile with relevant keywords",
    "Encourage customers to leave reviews on Google",
    "Build local citations on relevant directories",
    "Improve website's local keyword targeting"
  ];

  const report: SeoLocalReport = {
    id: reportId,
    clientId: clientId,
    title: `Local SEO Analysis for ${businessName} in ${location}`,
    businessName: businessName,
    location: location,
    googleMapsRanking: googleMapsRanking,
    googleReviewsCount: googleReviewsCount,
    keywordRankings: keywordRankings,
    recommendations: recommendations,
    date: new Date().toISOString(),
    address: location, // Using location as address since they're conceptually the same for local SEO
    phone: null,
    website: null
  };

  return report;
}

/**
 * Create a new local SEO report
 */
export async function createLocalSeoReport(reportData: {
  clientId: string;
  title: string;
  businessName: string;
  location: string;
  recommendations?: string[];
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
  keywordRankings?: any[];
  localListings?: any[];
  googleMapsRanking?: number;
  googleReviewsCount?: number;
}) {
  try {
    const { clientId, title, businessName, location, recommendations, phone, website, googleBusinessUrl, keywordRankings, localListings, googleMapsRanking, googleReviewsCount } = reportData;

    const { data, error } = await supabase
      .from('seo_local_reports')
      .insert([
        {
          client_id: clientId,
          title: title,
          business_name: businessName,
          location: location,
          recommendations: recommendations,
          phone: phone,
          website: website,
          google_business_url: googleBusinessUrl,
          keyword_rankings: keywordRankings,
          local_listings: localListings,
          google_maps_ranking: googleMapsRanking,
          google_reviews_count: googleReviewsCount,
          date: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Error creating local SEO report:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createLocalSeoReport:", error);
    throw error;
  }
}

/**
 * Update a local SEO report
 */
export async function updateLocalSeoReport(reportId: string, reportData: {
  title?: string;
  businessName?: string;
  location?: string;
  recommendations?: string[];
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
  keywordRankings?: any[];
  localListings?: any[];
  googleMapsRanking?: number;
  googleReviewsCount?: number;
}) {
  try {
    const { title, businessName, location, recommendations, phone, website, googleBusinessUrl, keywordRankings, localListings, googleMapsRanking, googleReviewsCount } = reportData;

    const { data, error } = await supabase
      .from('seo_local_reports')
      .update({
        title: title,
        business_name: businessName,
        location: location,
        recommendations: recommendations,
        phone: phone,
        website: website,
        google_business_url: googleBusinessUrl,
        keyword_rankings: keywordRankings,
        local_listings: localListings,
        google_maps_ranking: googleMapsRanking,
        google_reviews_count: googleReviewsCount
      })
      .eq('id', reportId)
      .select();

    if (error) {
      console.error("Error updating local SEO report:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateLocalSeoReport:", error);
    throw error;
  }
}

/**
 * Get all local SEO reports for a client
 */
export async function getLocalSeoReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
    console.log("Getting local SEO reports for client:", clientId);

    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId);

    if (error) {
      console.error("Error fetching local SEO reports:", error);
      throw error;
    }

    console.log("Local SEO reports retrieved:", data);
    
    // Transform database schema to match our TypeScript interface
    const reports: SeoLocalReport[] = (data || []).map(report => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      businessName: report.business_name,
      location: report.location || "",
      address: report.location || "", // Using location as address
      phone: report.phone,
      website: report.website,
      googleBusinessUrl: report.google_business_url,
      googleMapsRanking: report.google_maps_ranking || 0,
      googleReviewsCount: report.google_reviews_count !== undefined ? report.google_reviews_count : 0,
      googleReviewsAverage: report.google_reviews_average !== undefined 
                          ? (typeof report.google_reviews_average === 'number' 
                            ? report.google_reviews_average 
                            : parseFloat(String(report.google_reviews_average)) || 0) 
                          : 0,
      keywordRankings: report.keyword_rankings,
      localListings: report.local_listings,
      recommendations: report.recommendations,
      shareToken: report.share_token,
      sharedAt: report.shared_at
    }));
    
    return reports;
  } catch (error) {
    console.error("Error in getLocalSeoReports:", error);
    return [];
  }
}

/**
 * Get a specific local SEO report by ID
 */
export async function getLocalSeoReport(reportId: string): Promise<SeoLocalReport | null> {
  try {
    console.log("Getting local SEO report with ID:", reportId);

    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error("Error fetching local SEO report:", error);
      throw error;
    }

    console.log("Local SEO report retrieved:", data);
    
    if (!data) return null;
    
    // Transform database schema to match our TypeScript interface
    const report: SeoLocalReport = {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      businessName: data.business_name,
      location: data.location || "",
      address: data.location || "", // Using location as address
      phone: data.phone,
      website: data.website,
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking || 0,
      googleReviewsCount: data.google_reviews_count !== undefined ? data.google_reviews_count : 0,
      googleReviewsAverage: data.google_reviews_average !== undefined 
                          ? (typeof data.google_reviews_average === 'number' 
                            ? data.google_reviews_average 
                            : parseFloat(String(data.google_reviews_average)) || 0) 
                          : 0,
      keywordRankings: data.keyword_rankings,
      localListings: data.local_listings,
      recommendations: data.recommendations,
      shareToken: data.share_token,
      sharedAt: data.shared_at
    };
    
    return report;
  } catch (error) {
    console.error("Error in getLocalSeoReport:", error);
    return null;
  }
}

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
