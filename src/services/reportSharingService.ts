import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Function to get the URL for a shared report
export const getSharedReportUrl = async (reportId: string): Promise<string | null> => {
  try {
    // Si el ID no es válido, devolvemos null
    if (!reportId || reportId === "new") {
      console.log("Invalid report ID for sharing:", reportId);
      return null;
    }
    
    // Obtener el token de compartir desde la base de datos
    const { data, error } = await supabase
      .from('client_reports')
      .select('share_token')
      .eq('id', reportId)
      .maybeSingle();
    
    if (error) {
      console.error('Error retrieving share token:', error);
      return null;
    }

    if (!data || !data.share_token) {
      console.log("No share token found for report:", reportId);
      return null;
    }

    // Construct the share URL with the token
    return `/report-share/${data.share_token}`;
  } catch (error) {
    console.error('Error getting shared report URL:', error);
    return null;
  }
};

// Function to generate a new share token for a report
export const generateShareToken = async (reportId: string): Promise<string | null> => {
  try {
    const token = uuidv4();
    
    const { error } = await supabase
      .from('client_reports')
      .update({ 
        share_token: token,
        shared_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) {
      console.error('Error generating share token:', error);
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error in generateShareToken:', error);
    return null;
  }
};

// Function to get a report by its share token
export const getReportByShareToken = async (token: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('client_reports')
      .select('*')
      .eq('share_token', token)
      .maybeSingle();
    
    if (error) {
      console.error('Error retrieving report by share token:', error);
      return null;
    }
    
    if (!data) {
      console.log("No report found with share token:", token);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getReportByShareToken:', error);
    return null;
  }
};

// Function to generate a public proposal URL
export const generatePublicProposalUrl = (proposalId: string, token: string): string => {
  return `/proposal-share/${token}`;
};

// Other sharing-related functions can be added here
