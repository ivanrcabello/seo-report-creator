
// Define the ContractSection type
export interface ContractSection {
  title: string;
  content: string;
  order: number;
}

// Get default contract sections
export const getDefaultContractSections = (): ContractSection[] => {
  return [
    {
      title: "Objeto del contrato",
      content: "El objeto del presente contrato es la prestación de servicios profesionales de SEO.",
      order: 0
    },
    {
      title: "Duración del contrato",
      content: "El presente contrato tendrá una duración inicial de 12 meses, renovable automáticamente.",
      order: 1
    },
    {
      title: "Honorarios",
      content: "Los honorarios se componen de una tarifa inicial y una cuota mensual.",
      order: 2
    },
    {
      title: "Condiciones de pago",
      content: "Los pagos se realizarán mediante transferencia bancaria en los primeros 5 días de cada mes.",
      order: 3
    }
  ];
};

// Create default contract sections
export const createDefaultContractSections = (): ContractSection[] => {
  return getDefaultContractSections();
};

// Create a placeholder contractPdf service
export const ContractSection = {
  getDefaultSections: getDefaultContractSections
};
