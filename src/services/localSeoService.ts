
import { supabaseClient } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SeoLocalReport } from '@/types/client';

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
    const { data: documents, error } = await supabaseClient
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

    const { data, error } = await supabaseClient
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
      address: data.address || data.location,
      location: data.location,
      phone: data.phone,
      website: data.website,
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking,
      googleReviewsCount: data.google_reviews_count,
      keywordRankings: data.keyword_rankings,
      localListings: data.local_listings,
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
    if (updates.address) reportData.address = updates.address;
    if (updates.location) reportData.location = updates.location;
    if (updates.phone) reportData.phone = updates.phone;
    if (updates.website) reportData.website = updates.website;
    if (updates.googleBusinessUrl) reportData.google_business_url = updates.googleBusinessUrl;
    if (updates.googleMapsRanking) reportData.google_maps_ranking = updates.googleMapsRanking;
    if (updates.googleReviewsCount) reportData.google_reviews_count = updates.googleReviewsCount;
    if (updates.keywordRankings) reportData.keyword_rankings = updates.keywordRankings;
    if (updates.localListings) reportData.local_listings = updates.localListings;
    if (updates.recommendations) reportData.recommendations = updates.recommendations;
    
    const { error } = await supabaseClient
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
