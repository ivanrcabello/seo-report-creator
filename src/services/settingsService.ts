
import { supabase } from '@/integrations/supabase/client';
import { CompanySettings } from '@/types/settings';

// Get company settings
export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching company settings:", error);
      return null;
    }
    
    return data as CompanySettings;
  } catch (error) {
    console.error("Error in getCompanySettings:", error);
    return null;
  }
};

// Update company settings
export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings | null> => {
  try {
    // Check if there are existing settings
    const { data: existingSettings } = await supabase
      .from('company_settings')
      .select('id')
      .single();
    
    let result;
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('company_settings')
        .update({
          ...settings,
          updatedAt: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('company_settings')
        .insert({
          ...settings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return result as CompanySettings;
  } catch (error) {
    console.error("Error updating company settings:", error);
    return null;
  }
};
