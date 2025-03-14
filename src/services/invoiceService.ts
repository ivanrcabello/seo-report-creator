
import { Invoice } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { getSeoPack } from "./packService";
import { getProposal } from "./proposal/proposalCrud";
import { getClient } from "./clientService";

// Función para generar un número de factura secuencial
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

// Función para convertir datos de Supabase al formato de la aplicación
const mapInvoiceFromDB = (invoice: any): Invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoice_number,
  clientId: invoice.client_id,
  issueDate: invoice.issue_date,
  dueDate: invoice.due_date,
  packId: invoice.pack_id,
  proposalId: invoice.proposal_id,
  baseAmount: invoice.base_amount,
  taxRate: invoice.tax_rate,
  taxAmount: invoice.tax_amount,
  totalAmount: invoice.total_amount,
  status: invoice.status,
  paymentDate: invoice.payment_date,
  notes: invoice.notes,
  pdfUrl: invoice.pdf_url,
  createdAt: invoice.created_at,
  updatedAt: invoice.updated_at
});

// Función para convertir datos de la aplicación al formato de Supabase
const mapInvoiceToDB = (invoice: Partial<Invoice>) => ({
  invoice_number: invoice.invoiceNumber,
  client_id: invoice.clientId,
  issue_date: invoice.issueDate,
  due_date: invoice.dueDate,
  pack_id: invoice.packId,
  proposal_id: invoice.proposalId,
  base_amount: invoice.baseAmount,
  tax_rate: invoice.taxRate,
  tax_amount: invoice.taxAmount,
  total_amount: invoice.totalAmount,
  status: invoice.status,
  payment_date: invoice.paymentDate,
  notes: invoice.notes,
  pdf_url: invoice.pdfUrl,
  updated_at: new Date().toISOString()
});

// Operaciones CRUD para facturas
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching client invoices:", error);
    return [];
  }
  
  return (data || []).map(mapInvoiceFromDB);
};

export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching invoice:", error);
    return undefined;
  }
  
  return data ? mapInvoiceFromDB(data) : undefined;
};

export const createInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "invoiceNumber">): Promise<Invoice | undefined> => {
  try {
    // Generar número de factura
    const invoiceNumber = await generateInvoiceNumber();
    
    const now = new Date().toISOString();
    const newInvoice = {
      ...mapInvoiceToDB(invoice),
      invoice_number: invoiceNumber,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice:", error);
      return undefined;
    }
    
    return mapInvoiceFromDB(data);
  } catch (error) {
    console.error("Error in createInvoice:", error);
    return undefined;
  }
};

export const updateInvoice = async (invoice: Invoice): Promise<Invoice | undefined> => {
  const { data, error } = await supabase
    .from('invoices')
    .update(mapInvoiceToDB(invoice))
    .eq('id', invoice.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating invoice:", error);
    return undefined;
  }
  
  return mapInvoiceFromDB(data);
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting invoice:", error);
    return false;
  }
  
  return true;
};

// Funciones de facturación desde propuestas y packs
export const createInvoiceFromProposal = async (
  proposalId: string,
  dueDate?: string
): Promise<Invoice | undefined> => {
  try {
    const proposal = await getProposal(proposalId);
    if (!proposal) return undefined;
    
    let baseAmount = proposal.customPrice;
    
    // Si no hay precio personalizado, usar el del pack
    if (!baseAmount && proposal.packId) {
      const pack = await getSeoPack(proposal.packId);
      if (pack) {
        baseAmount = pack.price;
      }
    }
    
    if (!baseAmount) {
      console.error("No price found for invoice creation");
      return undefined;
    }
    
    // Calcular importes
    const taxRate = 21; // IVA estándar en España
    const taxAmount = (baseAmount * taxRate) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    // Crear datos de factura
    const invoiceData = {
      clientId: proposal.clientId,
      proposalId: proposal.id,
      packId: proposal.packId,
      baseAmount,
      taxRate,
      taxAmount,
      totalAmount,
      status: "pending" as const,
      dueDate: dueDate || null
    };
    
    return createInvoice(invoiceData as any);
  } catch (error) {
    console.error("Error creating invoice from proposal:", error);
    return undefined;
  }
};

// Función para actualizar el estado de pago de una factura
export const markInvoiceAsPaid = async (invoiceId: string): Promise<Invoice | undefined> => {
  try {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) return undefined;
    
    const updatedInvoice = {
      ...invoice,
      status: "paid" as const,
      paymentDate: new Date().toISOString()
    };
    
    return updateInvoice(updatedInvoice);
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return undefined;
  }
};

// Función para generar PDF de factura (esta implementación requerirá una librería PDF)
export const generateInvoicePdf = async (invoiceId: string): Promise<string | undefined> => {
  // Esta función se implementará más adelante con jsPDF o similar
  // Por ahora, retornamos un valor ficticio
  return undefined;
};
