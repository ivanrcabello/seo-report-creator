
import { CompanySettings } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";

// Función para convertir datos de Supabase al formato de la aplicación
const mapSettingsFromDB = (settings: any): CompanySettings => ({
  id: settings.id,
  companyName: settings.company_name,
  taxId: settings.tax_id,
  address: settings.address,
  phone: settings.phone,
  email: settings.email,
  logoUrl: settings.logo_url,
  primaryColor: settings.primary_color,
  secondaryColor: settings.secondary_color,
  accentColor: settings.accent_color,
  bankAccount: settings.bank_account,
  createdAt: settings.created_at,
  updatedAt: settings.updated_at
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapSettingsToDB = (settings: Partial<CompanySettings>) => ({
  company_name: settings.companyName,
  tax_id: settings.taxId,
  address: settings.address,
  phone: settings.phone,
  email: settings.email,
  logo_url: settings.logoUrl,
  primary_color: settings.primaryColor,
  secondary_color: settings.secondaryColor,
  accent_color: settings.accentColor,
  bank_account: settings.bankAccount,
  updated_at: new Date().toISOString()
});

// Obtener la configuración de la empresa
export const getCompanySettings = async (): Promise<CompanySettings | undefined> => {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching company settings:", error);
    return undefined;
  }
  
  return data ? mapSettingsFromDB(data) : undefined;
};

// Actualizar la configuración de la empresa
export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings | undefined> => {
  // Primero obtenemos el ID de la configuración actual
  const current = await getCompanySettings();
  
  if (!current) {
    console.error("No company settings found to update");
    return undefined;
  }
  
  const { data, error } = await supabase
    .from('company_settings')
    .update(mapSettingsToDB(settings))
    .eq('id', current.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating company settings:", error);
    return undefined;
  }
  
  return mapSettingsFromDB(data);
};

// Función para cargar logo de la empresa
export const uploadCompanyLogo = async (file: File): Promise<string | undefined> => {
  if (!file) return undefined;
  
  const fileExt = file.name.split('.').pop();
  const filePath = `company/logo_${new Date().getTime()}.${fileExt}`;
  
  // Subir el archivo a Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error("Error uploading company logo:", error);
    return undefined;
  }
  
  // Obtener la URL pública del logo subido
  const { data: publicUrl } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);
  
  return publicUrl.publicUrl;
};

// Interfaces para API Keys
export interface ApiKeys {
  id?: string;
  openaiApiKey: string;
  createdAt?: string;
  updatedAt?: string;
}

// Obtener las claves API
export const getApiKeys = async (): Promise<ApiKeys | undefined> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching API keys:", error);
    return undefined;
  }
  
  return data ? {
    id: data.id,
    openaiApiKey: data.openai_api_key,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } : undefined;
};

// Actualizar las claves API
export const updateApiKeys = async (keys: ApiKeys): Promise<ApiKeys | undefined> => {
  const current = await getApiKeys();
  
  if (current) {
    // Actualizar el registro existente
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        openai_api_key: keys.openaiApiKey,
        updated_at: new Date().toISOString()
      })
      .eq('id', current.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating API keys:", error);
      return undefined;
    }
    
    return {
      id: data.id,
      openaiApiKey: data.openai_api_key,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } else {
    // Crear un nuevo registro
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        openai_api_key: keys.openaiApiKey
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating API keys:", error);
      return undefined;
    }
    
    return {
      id: data.id,
      openaiApiKey: data.openai_api_key,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
};
