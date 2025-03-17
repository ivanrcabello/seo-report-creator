
/**
 * This file re-exports all invoice CRUD operations from their specialized files
 * for backward compatibility and ease of use.
 */

// Re-export all query operations
export { 
  getInvoices,
  getInvoice,
  getClientInvoices
} from './operations/invoiceQueries';

// Re-export all mutation operations
export { 
  createInvoice,
  updateInvoice,
  deleteInvoice
} from './operations/invoiceMutations';

// Re-export all specialized operations
export { 
  createInvoiceFromProposal,
  markInvoiceAsPaid
} from './operations/invoiceSpecialOperations';
