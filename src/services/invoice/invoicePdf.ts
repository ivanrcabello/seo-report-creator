
/**
 * Invoice PDF generation functionality
 * This file re-exports PDF-related functionality from the smaller, focused modules
 */

// Make sure jspdf-autotable is imported before using it
import 'jspdf-autotable';

// Re-export all PDF-related functionality
export { generateInvoicePdf } from './pdf/pdfGenerator';
export { 
  downloadInvoicePdf, 
  sendInvoiceByEmail,
  shareInvoice,
  getInvoiceByShareToken,
  markInvoiceAsPaid 
} from './pdf/pdfOperations';
