
// Export all contract-related functionality from a single entry point
import { 
  getContracts, 
  getClientContracts, 
  getContract, 
  createContract, 
  updateContract, 
  deleteContract, 
  signContract 
} from './contractCrud';

import { createDefaultContractSections } from './contractSections';
import { generateContractPDF, saveContractPDF } from './contractPdf';
import {
  getContractByShareToken,
  generateContractShareToken,
  generateShareableContractUrl,
  getContractShareUrl,
  shareContract,
  signContractByClient
} from './contractSharing';

// Generate and save contract PDF
export const generateAndSaveContractPDF = async (contractId: string): Promise<string> => {
  const contract = await getContract(contractId);
  
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }
  
  const pdfBlob = await generateContractPDF(contract);
  const pdfUrl = await saveContractPDF(contractId, pdfBlob);
  
  return pdfUrl;
};

// Export all functions
export {
  getContracts,
  getClientContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  signContract,
  createDefaultContractSections,
  generateContractPDF,
  saveContractPDF,
  getContractByShareToken,
  generateContractShareToken,
  generateShareableContractUrl,
  getContractShareUrl,
  shareContract,
  signContractByClient
};
