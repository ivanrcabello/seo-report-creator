
import { Invoice } from "@/types/invoice";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { mapInvoiceFromDB, mapInvoiceToDB } from "./invoice/invoiceMappers";
import { generateInvoiceNumber } from "./invoice/invoiceNumberGenerator";
import { generateInvoicePdf } from "./invoice/pdf/pdfGenerator";
import {
  downloadInvoicePdf,
  sendInvoiceByEmail
} from "./invoice/pdf/pdfOperations";

// Re-export invoice CRUD operations
export { 
  getInvoices,
  getInvoice,
  getClientInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  createInvoiceFromProposal
} from "./invoice/invoiceCrud";

// Re-export PDF operations
export { 
  downloadInvoicePdf,
  sendInvoiceByEmail, 
  generateInvoicePdf
};
