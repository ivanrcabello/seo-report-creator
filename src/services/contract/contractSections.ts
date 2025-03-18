
import { ContractSection } from "@/types/client";

/**
 * Creates default contract sections with template content
 */
export function createDefaultContractSections(): ContractSection[] {
  return [
    {
      id: "intro",
      title: "Introducción",
      content: "Este contrato establece los términos y condiciones para la prestación de servicios SEO entre las partes."
    },
    {
      id: "services",
      title: "Servicios incluidos",
      content: "- Optimización on-page\n- Creación de contenido\n- Análisis de palabras clave\n- Informes mensuales de rendimiento"
    },
    {
      id: "terms",
      title: "Términos de servicio",
      content: "El servicio se prestará por un periodo inicial especificado en este contrato, con posibilidad de renovación automática salvo notificación por escrito."
    },
    {
      id: "payment",
      title: "Condiciones de pago",
      content: "Se establece un pago inicial por la fase de implementación, seguido de pagos mensuales por el mantenimiento SEO."
    },
    {
      id: "confidentiality",
      title: "Confidencialidad",
      content: "Ambas partes se comprometen a mantener la confidencialidad de toda la información compartida durante la prestación de los servicios."
    },
    {
      id: "termination",
      title: "Terminación",
      content: "Cualquiera de las partes podrá rescindir este contrato con un preaviso de 30 días mediante notificación por escrito."
    }
  ];
}

/**
 * Creates an empty contract section
 */
export function createEmptyContractSection(): ContractSection {
  return {
    id: `section-${Date.now()}`,
    title: "",
    content: ""
  };
}
