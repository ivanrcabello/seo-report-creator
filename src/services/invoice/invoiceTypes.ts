
import { Client } from "@/types/client";

/**
 * Invoice type interface
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName?: string; // Added for display purposes
  issueDate: string;
  dueDate?: string;
  packId?: string;
  proposalId?: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled" | "draft";
  paymentDate?: string;
  paidAt?: string; // Added for compatibility
  notes?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}
