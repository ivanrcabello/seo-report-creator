
import { supabase } from "@/integrations/supabase/client";

/**
 * Mark an invoice as paid
 */
export const markInvoiceAsPaid = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid' as 'pending' | 'paid' | 'cancelled' | 'draft', // Fix the type issue by casting
        payment_date: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error marking invoice as paid:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markInvoiceAsPaid:', error);
    return false;
  }
};
