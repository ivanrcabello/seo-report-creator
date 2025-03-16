
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SeoLocalReport } from '@/types/client';

/**
 * Fetch all local SEO reports for a client
 */
export async function getLocalSeoReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
    // Validate clientId before querying
    if (!clientId || clientId.trim() === '') {
      console.error('Invalid clientId provided to getLocalSeoReports');
      return [];
    }
    
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching local SEO reports:', error);
      return [];
    }
    
    return data.map((report): SeoLocalReport => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      businessName: report.business_name,
      address: report.location, // Use location as address since it's the old field
      location: report.location,
      phone: report.phone,
      website: report.website,
      googleBusinessUrl: report.google_business_url,
      googleMapsRanking: report.google_maps_ranking || 0,
      googleReviewsCount: 0, // Field doesn't exist in DB
      keywordRankings: Array.isArray(report.keyword_rankings) ? report.keyword_rankings : 
                      (typeof report.keyword_rankings === 'string' ? JSON.parse(report.keyword_rankings) : []),
      localListings: Array.isArray(report.local_listings) ? report.local_listings : 
                    (typeof report.local_listings === 'string' ? JSON.parse(report.local_listings) : []),
      recommendations: report.recommendations || [],
      shareToken: report.share_token || null,
      sharedAt: report.shared_at || null
    }));
  } catch (error) {
    console.error('Error in getLocalSeoReports:', error);
    return [];
  }
}

/**
 * Generate a local SEO analysis from selected documents
 */
export async function generateLocalSeoAnalysis(
  documentIds: string[],
  clientId: string,
  clientName: string
) {
  try {
    // Validate clientId
    if (!clientId || clientId.trim() === '') {
      throw new Error('Invalid clientId provided to generateLocalSeoAnalysis');
    }
    
    // Notify the user that we're starting the AI analysis
    console.log('Generating local SEO analysis...');
    
    // Retrieve document content to analyze
    const { data: documents, error } = await supabase
      .from('client_documents')
      .select('*')
      .in('id', documentIds);
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents for analysis');
    }
    
    // Get business settings if available
    const { data: settings } = await supabase
      .from('client_local_seo_settings')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    // Basic simulated analysis result
    // In a real-world scenario, this would be processed by an AI model
    const analysisResult = {
      businessName: settings?.business_name || clientName,
      address: settings?.address || 
               (documents[0]?.content?.match(/(?:Address|Dirección):\s*([^\n]+)/i)?.[1] || "No address found"),
      location: settings?.address || "No location found",
      phone: settings?.phone || 
             (documents[0]?.content?.match(/(?:Phone|Teléfono):\s*([^\n]+)/i)?.[1] || null),
      website: settings?.website || 
              (documents[0]?.content?.match(/(?:Website|Web|Sitio):\s*([^\n]+)/i)?.[1] || null),
      googleBusinessUrl: settings?.google_business_url || null,
      googleMapsRanking: Math.floor(Math.random() * 20) + 1,
      googleReviewsCount: Math.floor(Math.random() * 50),
      localListings: [
        { name: "Google My Business", listed: Math.random() > 0.3, url: "https://business.google.com" },
        { name: "Yelp", listed: Math.random() > 0.5, url: "https://yelp.com" },
        { name: "Facebook", listed: Math.random() > 0.4, url: "https://facebook.com" },
        { name: "TripAdvisor", listed: Math.random() > 0.6, url: "https://tripadvisor.com" }
      ],
      recommendations: [
        "Optimizar la ficha de Google My Business con más fotos y descripción completa",
        "Solicitar reseñas a clientes satisfechos regularmente",
        "Crear publicaciones semanales en Google My Business",
        "Responder a todas las reseñas positivas y negativas"
      ]
    };
    
    return analysisResult;
  } catch (error) {
    console.error('Error in generateLocalSeoAnalysis:', error);
    throw error;
  }
}

/**
 * Create a new local SEO report in the database
 */
export async function createLocalSeoReport(
  analysis: any,
  clientId: string,
  clientName: string
): Promise<SeoLocalReport> {
  try {
    // Validate clientId
    if (!clientId || clientId.trim() === '') {
      throw new Error('Invalid clientId provided to createLocalSeoReport');
    }
    
    const reportId = uuidv4();
    const reportData = {
      id: reportId,
      client_id: clientId,
      title: `Informe SEO Local - ${clientName}`,
      business_name: analysis.businessName,
      location: analysis.address || "Sin ubicación específica", // Map address to location field
      phone: analysis.phone,
      website: analysis.website,
      google_business_url: analysis.googleBusinessUrl,
      google_maps_ranking: analysis.googleMapsRanking || 0,
      local_listings: analysis.localListings || [],
      keyword_rankings: analysis.keywordRankings || [],
      recommendations: analysis.recommendations || [],
      date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('seo_local_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error('Error creating local SEO report:', error);
      throw new Error('Failed to create local SEO report');
    }

    // Map DB structure to application model
    return {
      id: data.id,
      clientId: data.client_id,
      title: data.title,
      date: data.date,
      businessName: data.business_name,
      address: data.location, // Use location as address
      location: data.location,
      phone: data.phone,
      website: data.website,
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking || 0,
      googleReviewsCount: 0, // Field doesn't exist in DB
      keywordRankings: Array.isArray(data.keyword_rankings) ? data.keyword_rankings : 
                      (typeof data.keyword_rankings === 'string' ? JSON.parse(data.keyword_rankings) : []),
      localListings: Array.isArray(data.local_listings) ? data.local_listings : 
                    (typeof data.local_listings === 'string' ? JSON.parse(data.local_listings) : []),
      recommendations: data.recommendations || [],
      shareToken: data.share_token,
      sharedAt: data.shared_at
    };
  } catch (error) {
    console.error('Error in createLocalSeoReport:', error);
    throw error;
  }
}

/**
 * Update a local SEO report in the database
 */
export async function updateLocalSeoReport(
  reportId: string,
  updates: Partial<SeoLocalReport>
): Promise<boolean> {
  try {
    // Validate reportId
    if (!reportId || reportId.trim() === '') {
      console.error('Invalid reportId provided to updateLocalSeoReport');
      return false;
    }
    
    // Convert application model to DB structure
    const reportData: Record<string, any> = {};
    
    if (updates.title) reportData.title = updates.title;
    if (updates.businessName) reportData.business_name = updates.businessName;
    if (updates.address) reportData.location = updates.address; // Map address to location
    if (updates.location) reportData.location = updates.location;
    if (updates.phone !== undefined) reportData.phone = updates.phone;
    if (updates.website !== undefined) reportData.website = updates.website;
    if (updates.googleBusinessUrl !== undefined) reportData.google_business_url = updates.googleBusinessUrl;
    if (updates.googleMapsRanking) reportData.google_maps_ranking = updates.googleMapsRanking;
    if (updates.keywordRankings) reportData.keyword_rankings = updates.keywordRankings;
    if (updates.localListings) reportData.local_listings = updates.localListings;
    if (updates.recommendations) reportData.recommendations = updates.recommendations;
    
    const { error } = await supabase
      .from('seo_local_reports')
      .update(reportData)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating local SEO report:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateLocalSeoReport:', error);
    return false;
  }
}

/**
 * Get client local SEO settings
 */
export async function getLocalSeoSettings(clientId: string) {
  try {
    // Validate clientId before querying
    if (!clientId || clientId.trim() === '') {
      console.error('Invalid clientId provided to getLocalSeoSettings');
      return null;
    }
    
    console.log('Fetching local SEO settings for client:', clientId);
    
    const { data, error } = await supabase
      .from('client_local_seo_settings')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid error when no row is found
      
    if (error) {
      console.error('Error fetching local SEO settings:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getLocalSeoSettings:', error);
    return null;
  }
}

/**
 * Save client local SEO settings
 */
export async function saveLocalSeoSettings(settings: {
  id?: string;
  clientId: string;
  businessName: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  googleBusinessUrl?: string | null;
  targetLocations?: string[];
  googleMapsRanking?: number;
  googleReviewsCount?: number;
  googleReviewsAverage?: number;
  listingsCount?: number;
}) {
  try {
    // Validate clientId
    if (!settings.clientId || settings.clientId.trim() === '') {
      console.error('Invalid clientId provided to saveLocalSeoSettings');
      throw new Error('Client ID is required');
    }
    
    console.log('Saving local SEO settings for client:', settings.clientId);
    
    const dataToSave = {
      client_id: settings.clientId,
      business_name: settings.businessName,
      address: settings.address,
      phone: settings.phone || null,
      website: settings.website || null,
      google_business_url: settings.googleBusinessUrl || null,
      target_locations: settings.targetLocations || [],
      google_maps_ranking: settings.googleMapsRanking || 0,
      google_reviews_count: settings.googleReviewsCount || 0,
      google_reviews_average: settings.googleReviewsAverage || 0,
      listings_count: settings.listingsCount || 0,
    };
    
    let result;
    
    if (settings.id) {
      // Update existing record
      console.log('Updating existing settings with ID:', settings.id);
      const { data, error } = await supabase
        .from('client_local_seo_settings')
        .update(dataToSave)
        .eq('id', settings.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      console.log('Inserting new settings for client:', settings.clientId);
      const { data, error } = await supabase
        .from('client_local_seo_settings')
        .insert(dataToSave)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error in saveLocalSeoSettings:', error);
    throw error;
  }
}

/**
 * Get historical local SEO metrics
 */
export async function getLocalSeoMetricsHistory(clientId: string) {
  try {
    // Validate clientId
    if (!clientId || clientId.trim() === '') {
      console.error('Invalid clientId provided to getLocalSeoMetricsHistory');
      return [];
    }
    
    const { data, error } = await supabase
      .from('local_seo_metrics')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching local SEO metrics history:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getLocalSeoMetricsHistory:', error);
    return [];
  }
}

/**
 * Save local SEO metrics to the history table
 */
export async function saveLocalSeoMetrics(
  clientId: string,
  metrics: {
    googleMapsRanking?: number;
    googleReviewsCount?: number;
    googleReviewsAverage?: number;
    listingsCount?: number;
  }
) {
  try {
    // Validate clientId
    if (!clientId || clientId.trim() === '') {
      console.error('Invalid clientId provided to saveLocalSeoMetrics');
      return false;
    }
    
    const { error } = await supabase
      .from('local_seo_metrics')
      .insert({
        client_id: clientId,
        google_maps_ranking: metrics.googleMapsRanking || 0,
        google_reviews_count: metrics.googleReviewsCount || 0,
        google_reviews_average: metrics.googleReviewsAverage || 0,
        listings_count: metrics.listingsCount || 0,
      });
      
    if (error) {
      console.error('Error saving local SEO metrics history:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveLocalSeoMetrics:', error);
    return false;
  }
}
