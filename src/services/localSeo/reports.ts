
import { supabase } from '@/integrations/supabase/client';
import { SeoLocalReport } from '@/types/client';

/**
 * Get local SEO reports for a client
 */
export async function getLocalSeoReports(clientId: string): Promise<SeoLocalReport[]> {
  try {
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      console.error('Invalid clientId in getLocalSeoReports:', clientId);
      return [];
    }

    console.log('Getting local SEO reports for client:', clientId);
    
    const { data, error } = await supabase
      .from('seo_local_reports')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching local SEO reports:', error);
      throw error;
    }
    
    console.log('Local SEO reports retrieved:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getLocalSeoReports:', error);
    return [];
  }
}

/**
 * Save local SEO report
 */
export async function saveLocalSeoReport(report: SeoLocalReport): Promise<SeoLocalReport | null> {
  try {
    if (!report.client_id || typeof report.client_id !== 'string' || report.client_id.trim() === '') {
      console.error('Invalid clientId in saveLocalSeoReport:', report.client_id);
      throw new Error('Client ID is required');
    }

    console.log('Saving local SEO report for client:', report.client_id);
    
    const { data, error } = await supabase
      .from('seo_local_reports')
      .upsert(report)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving local SEO report:', error);
      throw error;
    }
    
    console.log('Local SEO report saved:', data);
    return data;
  } catch (error) {
    console.error('Error in saveLocalSeoReport:', error);
    return null;
  }
}
