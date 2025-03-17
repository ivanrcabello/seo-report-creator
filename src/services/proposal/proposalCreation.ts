
import { Proposal } from "@/types/client";
import { getSeoPack } from "../packService";
import { addProposal } from "./proposalCrud";
import { generateProposalContent } from "../openai/proposalService";
import { getClient } from "../clientService";

// Función para crear una propuesta basada en un paquete
export const createProposalFromPack = async (
  clientId: string,
  packId: string,
  title: string,
  description: string,
  customPrice?: number,
  customFeatures?: string[],
  additionalNotes?: string
): Promise<Proposal | undefined> => {
  try {
    const pack = await getSeoPack(packId);
    const client = await getClient(clientId);
    
    if (pack && client) {
      // Generate AI content if we have client and pack data
      let aiContent = null;
      try {
        aiContent = await generateProposalContent(client, pack, additionalNotes);
      } catch (error) {
        console.error("Error generating AI content:", error);
      }
      
      const proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt"> = {
        clientId,
        packId,
        title,
        description,
        status: 'draft',
        customPrice,
        customFeatures,
        additionalNotes,
        aiContent
      };
      
      return addProposal(proposal);
    }
    
    return undefined;
  } catch (error) {
    console.error("Error creating proposal from pack:", error);
    throw error;
  }
};
