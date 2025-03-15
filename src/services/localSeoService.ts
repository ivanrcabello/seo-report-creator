
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
        location: 'Madrid, España',
        phone: '+34 91 XXX XX XX',
        website: 'www.tunegocio.es',
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
      address: data.address,
      phone: data.phone || '+34 91 XXX XX XX', // Ensure phone is never null
      website: data.website || 'www.example.com', // Ensure website is never null
      googleBusinessUrl: data.google_business_url,
      googleMapsRanking: data.google_maps_ranking,
      googleReviewsCount: data.google_reviews_count,
      keywordRankings: data.keyword_rankings,
      localListings: data.local_listings,
      recommendations: data.recommendations,
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
