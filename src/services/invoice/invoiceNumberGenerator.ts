
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a sequential invoice number based on the current year and the last invoice number.
 */
export const generateInvoiceNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear().toString();
  
  // Obtener la última factura creada para determinar el siguiente número
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error("Error getting last invoice number:", error);
    return `${currentYear}-0001`;
  }
  
  if (!data) {
    return `${currentYear}-0001`;
  }
  
  // Extraer el año y el número de la última factura
  const parts = data.invoice_number.split('-');
  const lastYear = parts[0];
  const lastNumber = parseInt(parts[1], 10);
  
  // Si es un nuevo año, comenzar desde 0001, sino incrementar el último número
  if (lastYear !== currentYear) {
    return `${currentYear}-0001`;
  } else {
    const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `${currentYear}-${nextNumber}`;
  }
};
