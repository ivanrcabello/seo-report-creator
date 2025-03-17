
import { Proposal } from "@/types/client";

// Mapeo de la propuesta desde la base de datos al formato de la aplicación
export const mapProposalFromDB = (dbProposal: any): Proposal => {
  return {
    id: dbProposal.id,
    clientId: dbProposal.client_id,
    packId: dbProposal.pack_id,
    title: dbProposal.title,
    description: dbProposal.description,
    status: dbProposal.status,
    customPrice: dbProposal.custom_price,
    customFeatures: dbProposal.custom_features,
    publicUrl: dbProposal.public_url,
    sentAt: dbProposal.sent_at,
    expiresAt: dbProposal.expires_at,
    createdAt: dbProposal.created_at,
    updatedAt: dbProposal.updated_at,
    aiContent: dbProposal.ai_content
  };
};

// Mapeo de la propuesta desde el formato de la aplicación a la base de datos
export const mapProposalToDB = (proposal: Partial<Proposal>): any => {
  const result: any = {};
  
  if (proposal.id !== undefined) result.id = proposal.id;
  if (proposal.clientId !== undefined) result.client_id = proposal.clientId;
  if (proposal.packId !== undefined) result.pack_id = proposal.packId;
  if (proposal.title !== undefined) result.title = proposal.title;
  if (proposal.description !== undefined) result.description = proposal.description;
  if (proposal.status !== undefined) result.status = proposal.status;
  if (proposal.customPrice !== undefined) result.custom_price = proposal.customPrice;
  if (proposal.customFeatures !== undefined) result.custom_features = proposal.customFeatures;
  if (proposal.publicUrl !== undefined) result.public_url = proposal.publicUrl;
  if (proposal.sentAt !== undefined) result.sent_at = proposal.sentAt;
  if (proposal.expiresAt !== undefined) result.expires_at = proposal.expiresAt;
  if (proposal.createdAt !== undefined) result.created_at = proposal.createdAt;
  if (proposal.updatedAt !== undefined) result.updated_at = proposal.updatedAt;
  if (proposal.aiContent !== undefined) result.ai_content = proposal.aiContent;
  
  return result;
};
