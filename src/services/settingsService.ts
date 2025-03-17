
import { supabase } from '@/integrations/supabase/client';
import { CompanySettings } from '@/types/settings';

// API Keys interface
export interface ApiKeys {
  id?: string;
  openaiApiKey: string;
  createdAt?: string;
  updatedAt?: string;
}

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
    
    // Convert snake_case database fields to camelCase for our app
    if (data) {
      return {
        id: data.id,
        companyName: data.company_name,
        taxId: data.tax_id,
        address: data.address,
        phone: data.phone || undefined,
        email: data.email || undefined,
        logoUrl: data.logo_url || undefined,
        // Handle fields that might not exist in the database
        primaryColor: undefined,
        secondaryColor: undefined,
        accentColor: undefined,
        bankAccount: undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    return null;
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
    
    // Convert camelCase to snake_case for database
    const dbSettings = {
      company_name: settings.companyName,
      tax_id: settings.taxId,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      logo_url: settings.logoUrl,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('company_settings')
        .update(dbSettings)
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
          ...dbSettings,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    // Convert back to our app's camelCase format
    if (result) {
      return {
        id: result.id,
        companyName: result.company_name,
        taxId: result.tax_id,
        address: result.address,
        phone: result.phone || undefined,
        email: result.email || undefined,
        logoUrl: result.logo_url || undefined,
        // Handle fields that might not exist in the database
        primaryColor: undefined,
        secondaryColor: undefined,
        accentColor: undefined,
        bankAccount: undefined,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error updating company settings:", error);
    return null;
  }
};

// Upload company logo
export const uploadCompanyLogo = async (file: File): Promise<string | null> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `company-logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return null;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadCompanyLogo:', error);
    return null;
  }
};

// Get API keys
export const getApiKeys = async (): Promise<ApiKeys | null> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching API keys:", error);
      return null;
    }
    
    if (data) {
      return {
        id: data.id,
        openaiApiKey: data.openai_api_key || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in getApiKeys:", error);
    return null;
  }
};

// Update API keys
export const updateApiKeys = async (keys: ApiKeys): Promise<ApiKeys | null> => {
  try {
    // Check if there are existing keys
    const { data: existingKeys } = await supabase
      .from('api_keys')
      .select('id')
      .single();
    
    // Convert to snake_case for database
    const dbKeys = {
      openai_api_key: keys.openaiApiKey,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existingKeys) {
      // Update existing keys
      const { data, error } = await supabase
        .from('api_keys')
        .update(dbKeys)
        .eq('id', existingKeys.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new keys
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          ...dbKeys,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    // Convert back to our app's format
    if (result) {
      return {
        id: result.id,
        openaiApiKey: result.openai_api_key || '',
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error updating API keys:", error);
    return null;
  }
};
