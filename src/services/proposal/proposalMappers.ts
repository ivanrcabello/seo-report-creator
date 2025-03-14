
import { Proposal } from "@/types/client";

// Función para convertir datos de Supabase al formato de la aplicación
export const mapProposalFromDB = (proposal: any): Proposal => ({
  id: proposal.id,
  clientId: proposal.client_id,
  packId: proposal.pack_id,
  title: proposal.title,
  description: proposal.description,
  status: proposal.status,
  createdAt: proposal.created_at,
  updatedAt: proposal.updated_at,
  sentAt: proposal.sent_at,
  expiresAt: proposal.expires_at,
  customPrice: proposal.custom_price,
  customFeatures: proposal.custom_features,
  reportIds: proposal.report_ids,
  publicUrl: proposal.public_url,
});

// Función para convertir datos de la aplicación al formato de Supabase
export const mapProposalToDB = (proposal: Partial<Proposal>) => ({
  client_id: proposal.clientId,
  pack_id: proposal.packId,
  title: proposal.title,
  description: proposal.description,
  status: proposal.status,
  sent_at: proposal.sentAt,
  expires_at: proposal.expiresAt,
  custom_price: proposal.customPrice,
  custom_features: proposal.customFeatures,
  report_ids: proposal.reportIds,
  public_url: proposal.publicUrl,
});
