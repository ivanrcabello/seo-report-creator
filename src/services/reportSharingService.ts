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
      return null;
    }

    // Construct the share URL
    return `/report-share/${data.share_token}`;
  } catch (error) {
    console.error('Error getting shared report URL:', error);
    return null;
  }
};

// Function to generate a public proposal URL
export const generatePublicProposalUrl = (proposalId: string, token: string): string => {
  return `/proposal-share/${token}`;
};

// Other sharing-related functions can be added here
