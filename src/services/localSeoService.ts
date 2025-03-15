
import { supabase } from "@/integrations/supabase/client";
import { SeoLocalReport } from "@/types/client";

export const getLocalSeoData = async (clientId: string): Promise<SeoLocalReport | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching local SEO data:', error);
      return null;
    }

    if (!data) {
      // Return a sample report if no data exists
      return {
        id: 'local-report-sample',
        clientId: clientId,
        title: 'Informe SEO Local',
        date: new Date().toISOString(),
        businessName: 'Tu Negocio Local',
        address: '',
        location: 'Madrid, España',
        phone: '+34 91 XXX XX XX',
        website: 'www.tunegocio.es',
        googleBusinessUrl: '',
        googleMapsRanking: 4,
        googleReviewsCount: 15,
        localListings: [
          { platform: 'Google Business', status: 'Verificado' },
          { platform: 'Yelp', status: 'No listado' },
          { platform: 'TripAdvisor', url: 'https://tripadvisor.com/your-business', status: 'Listado' },
          { platform: 'Facebook Places', status: 'Listado' },
          { platform: 'Apple Maps', status: 'No listado' },
          { platform: 'Páginas Amarillas', status: 'Listado' }
        ],
        keywordRankings: [
          { keyword: 'tienda local madrid', position: 12 },
          { keyword: 'comprar productos locales', position: 18 },
          { keyword: 'tienda barrio salamanca', position: 5 }
        ],
        recommendations: [
          'Completar perfil de Google Business con más fotos',
          'Solicitar más reseñas a clientes satisfechos',
          'Optimizar listados en directorios principales',
          'Crear contenido específico para búsquedas locales',
          'Implementar schema markup para negocio local'
        ]
      };
    }

    return {
      id: data.id,
      clientId: data.client_id,
      businessName: data.business_name,
      address: data.address || '',
      phone: data.phone || '+34 91 XXX XX XX', // Ensure phone is never null
      website: data.website || 'www.example.com', // Ensure website is never null
      googleBusinessUrl: data.google_business_url || '',
      googleMapsRanking: data.google_maps_ranking || 0,
      googleReviewsCount: data.google_reviews_count || 0,
      keywordRankings: data.keyword_rankings || [],
      localListings: data.local_listings || [],
      recommendations: data.recommendations || [],
      title: data.title,
      date: data.date,
      location: data.location,
      shareToken: data.share_token,
      sharedAt: data.shared_at
    };
  } catch (error) {
    console.error('Error in getLocalSeoData:', error);
    return null;
  }
};

// Add the missing functions
export const generateLocalSeoAnalysis = async (documentIds: string[], clientId: string, clientName: string) => {
  console.log("Generating local SEO analysis for documents:", documentIds);
  
  // This function would normally analyze documents and generate SEO data
  // For now, we'll simulate it with a placeholder
  
  const sampleAnalysis: Omit<SeoLocalReport, "id"> = {
    clientId: clientId,
    title: `Informe SEO Local - ${clientName}`,
    date: new Date().toISOString(),
    businessName: clientName,
    address: "Calle Principal 123",
    location: "Madrid, España",
    phone: "+34 91 123 45 67",
    website: "www.example.com",
    googleBusinessUrl: "https://business.google.com/example",
    googleMapsRanking: 4,
    googleReviewsCount: 12,
    keywordRankings: [
      { keyword: "negocio local madrid", position: 15 },
      { keyword: "servicios profesionales madrid", position: 22 },
      { keyword: `${clientName.toLowerCase()} madrid`, position: 8 }
    ],
    localListings: [
      { platform: "Google Business", status: "Verificado" },
      { platform: "Yelp", status: "Listado" },
      { platform: "TripAdvisor", status: "No listado" }
    ],
    recommendations: [
      "Optimizar perfil de Google Business",
      "Conseguir más reseñas de clientes",
      "Mejorar presencia en directorios locales",
      "Crear contenido orientado a palabras clave locales"
    ]
  };
  
  console.log("Generated sample analysis:", sampleAnalysis);
  
  return sampleAnalysis;
};

export const createLocalSeoReport = async (
  analysis: Omit<SeoLocalReport, "id">, 
  clientId: string, 
  clientName: string
): Promise<SeoLocalReport> => {
  console.log("Creating local SEO report for client:", clientId, clientName);
  
  try {
    // Use the createSeoLocalReport function from localSeoReportService
    const id = await createSeoLocalReport(analysis);
    
    console.log("Created local SEO report with ID:", id);
    
    return {
      ...analysis,
      id
    };
  } catch (error) {
    console.error("Error creating local SEO report:", error);
    throw error;
  }
};

// Import the function to avoid circular dependency
import { createSeoLocalReport } from "./localSeoReportService";
