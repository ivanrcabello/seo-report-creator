
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SeoLocalReport } from '@/types/client';

/**
 * Fetch all local SEO reports for a client
 */
export async function getLocalSeoReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
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
      address: report.address || report.location, // Use location as fallback
      location: report.location,
      phone: report.phone || null,
      website: report.website || null,
      googleBusinessUrl: report.google_business_url || null,
      googleMapsRanking: report.google_maps_ranking || 0,
      googleReviewsCount: report.google_reviews_count || 0,
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
    
    // Basic simulated analysis result
    // In a real-world scenario, this would be processed by an AI model
    const analysisResult = {
      businessName: clientName,
      address: documents[0]?.content?.match(/(?:Address|Dirección):\s*([^\n]+)/i)?.[1] || "No address found",
      location: "No location found",
      phone: documents[0]?.content?.match(/(?:Phone|Teléfono):\s*([^\n]+)/i)?.[1] || "No phone found",
      website: documents[0]?.content?.match(/(?:Website|Web|Sitio):\s*([^\n]+)/i)?.[1] || "No website found",
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
    const reportId = uuidv4();
    const reportData = {
      id: reportId,
      client_id: clientId,
      title: `Informe SEO Local - ${clientName}`,
      business_name: analysis.businessName,
      address: analysis.address,
      location: analysis.location || "Sin ubicación específica",
      phone: analysis.phone,
      website: analysis.website,
      google_business_url: analysis.googleBusinessUrl || null,
      google_maps_ranking: analysis.googleMapsRanking || 0,
      google_reviews_count: analysis.googleReviewsCount || 0,
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
      phone: null, // Field doesn't exist in DB
      website: null, 
      googleBusinessUrl: null,
      googleMapsRanking: data.google_maps_ranking || 0,
      googleReviewsCount: 0, // Field doesn't exist in DB
      keywordRankings: Array.isArray(data.keyword_rankings) ? data.keyword_rankings : 
                      (typeof data.keyword_rankings === 'string' ? JSON.parse(data.keyword_rankings) : []),
      localListings: Array.isArray(data.local_listings) ? data.local_listings : 
                    (typeof data.local_listings === 'string' ? JSON.parse(data.local_listings) : []),
      recommendations: data.recommendations || [],
      shareToken: null,
      sharedAt: null
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
    // Convert application model to DB structure
    const reportData: Record<string, any> = {};
    
    if (updates.title) reportData.title = updates.title;
    if (updates.businessName) reportData.business_name = updates.businessName;
    if (updates.address) reportData.location = updates.address; // Map address to location
    if (updates.location) reportData.location = updates.location;
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
