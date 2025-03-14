
import { Client, SeoPack, Invoice, CompanySettings } from "@/types/client";

export interface InvoiceDetailProps {
  invoice: Invoice;
  client: Client | null;
  company: CompanySettings | null;
  packName: string | null;
  onDelete: () => Promise<void>;
  onMarkAsPaid: () => Promise<void>;
}
