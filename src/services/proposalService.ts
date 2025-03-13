
import { Proposal } from "@/types/client";
import { v4 as uuidv4 } from "uuid";
import { getSeoPack } from "./packService";

// Datos de ejemplo para propuestas
let proposals: Proposal[] = [
  {
    id: "101",
    clientId: "1",
    title: "Propuesta SEO para Empresa Tecnológica ABC",
    description: "Estrategia de posicionamiento web personalizada para mejorar la visibilidad online de Tecnológica ABC S.L.",
    packId: "2",
    status: "sent",
    createdAt: "2024-03-10T11:30:00Z",
    updatedAt: "2024-03-10T15:45:00Z",
    sentAt: "2024-03-10T15:45:00Z",
    expiresAt: "2024-04-10T23:59:59Z"
  },
  {
    id: "102",
    clientId: "2",
    title: "Plan SEO Premium para Tienda Online XYZ",
    description: "Plan de optimización SEO completo para aumentar las ventas y mejorar el posicionamiento de tiendaxyz.es",
    packId: "3",
    status: "accepted",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-02-25T14:20:00Z",
    sentAt: "2024-02-20T10:30:00Z",
    expiresAt: "2024-03-20T23:59:59Z",
    customPrice: 999.99, // Descuento especial
    customFeatures: [
      "Auditoría SEO completa",
      "Optimización de 25 palabras clave",
      "Informes semanales personalizados",
      "Optimización on-page y off-page",
      "Estrategia de contenidos avanzada",
      "Análisis de competencia detallado",
      "Soporte SEO dedicado",
      "Optimización de velocidad"
    ]
  }
];

// Operaciones CRUD para propuestas
export const getClientProposals = (clientId: string): Proposal[] => {
  return proposals.filter(proposal => proposal.clientId === clientId);
};

export const getAllProposals = (): Proposal[] => {
  return [...proposals];
};

export const getProposal = (id: string): Proposal | undefined => {
  return proposals.find(proposal => proposal.id === id);
};

export const addProposal = (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">): Proposal => {
  const now = new Date().toISOString();
  const newProposal: Proposal = {
    id: uuidv4(),
    ...proposal,
    createdAt: now,
    updatedAt: now
  };
  proposals = [...proposals, newProposal];
  return newProposal;
};

export const updateProposal = (proposal: Proposal): Proposal => {
  const updatedProposal = {
    ...proposal,
    updatedAt: new Date().toISOString()
  };
  proposals = proposals.map(p => p.id === proposal.id ? updatedProposal : p);
  return updatedProposal;
};

export const sendProposal = (id: string): Proposal | undefined => {
  const proposal = proposals.find(p => p.id === id);
  if (proposal) {
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 30); // Expira en 30 días
    
    const updatedProposal = {
      ...proposal,
      status: 'sent' as const,
      sentAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      updatedAt: now.toISOString()
    };
    
    proposals = proposals.map(p => p.id === id ? updatedProposal : p);
    return updatedProposal;
  }
  return undefined;
};

export const acceptProposal = (id: string): Proposal | undefined => {
  const proposal = proposals.find(p => p.id === id);
  if (proposal) {
    const updatedProposal = {
      ...proposal,
      status: 'accepted' as const,
      updatedAt: new Date().toISOString()
    };
    
    proposals = proposals.map(p => p.id === id ? updatedProposal : p);
    return updatedProposal;
  }
  return undefined;
};

export const rejectProposal = (id: string): Proposal | undefined => {
  const proposal = proposals.find(p => p.id === id);
  if (proposal) {
    const updatedProposal = {
      ...proposal,
      status: 'rejected' as const,
      updatedAt: new Date().toISOString()
    };
    
    proposals = proposals.map(p => p.id === id ? updatedProposal : p);
    return updatedProposal;
  }
  return undefined;
};

export const deleteProposal = (id: string): void => {
  proposals = proposals.filter(proposal => proposal.id !== id);
};

// Función para crear una propuesta basada en un paquete
export const createProposalFromPack = (
  clientId: string,
  packId: string,
  title: string,
  description: string,
  customPrice?: number,
  customFeatures?: string[]
): Proposal | undefined => {
  const pack = getSeoPack(packId);
  
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
};
