
import { Proposal } from "@/types/client";
import { getSeoPack } from "../packService";
import { addProposal } from "./proposalCrud";

// Función para crear una propuesta basada en un paquete
export const createProposalFromPack = async (
  clientId: string,
  packId: string,
  title: string,
  description: string,
  customPrice?: number,
  customFeatures?: string[]
): Promise<Proposal | undefined> => {
  try {
    const pack = await getSeoPack(packId);
    
    if (pack) {
      const proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt"> = {
        clientId,
        packId,
        title,
        description,
        status: 'draft',
        customPrice,
        customFeatures
      };
      
      return addProposal(proposal);
    }
    
    return undefined;
  } catch (error) {
    console.error("Error creating proposal from pack:", error);
    throw error;
  }
};
