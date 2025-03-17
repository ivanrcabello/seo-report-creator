
/**
 * Invoice payment functionality
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Mark an invoice as paid
 */
export const markInvoiceAsPaid = async (invoiceId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        payment_date: now,
        updated_at: now
      })
      .eq('id', invoiceId);
    
    if (error) {
      console.error("Error marking invoice as paid:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return false;
  }
};
