
import { ClientSummary } from "@/types/client";

export interface InvoiceStats {
  pendingCount: number;
  totalAmount: string;
  paidAmount: string;
  pendingAmount: string;
}

export interface ContractStats {
  activeCount: number;
  completedCount: number;
  draftCount: number;
  totalCount: number;
}

export interface DashboardTabProps {
  activeClientsCount: number;
  totalClientsCount: number;
  invoiceStats: InvoiceStats;
  contractStats: ContractStats;
  clientSummaries: ClientSummary[];
}

export interface DashboardProps {
  activeTab?: string;
  isNew?: boolean;
  newContract?: boolean;
  newProposal?: boolean;
}
