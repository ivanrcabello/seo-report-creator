
// Define ContractSection type
export interface ContractSection {
  title: string;
  content: string;
  order: number;
}

// Create default contract sections
export const createDefaultContractSections = (): ContractSection[] => {
  return [
    {
      title: "Introducción",
      content: "El presente contrato establece los términos y condiciones bajo los cuales se prestarán los servicios de posicionamiento web (SEO).",
      order: 1
    },
    {
      title: "Servicios",
      content: "Los servicios de posicionamiento web incluyen: análisis inicial, optimización on-page, desarrollo de contenidos, optimización técnica y seguimiento de resultados.",
      order: 2
    },
    {
      title: "Primera fase",
      content: "Durante la primera fase, se realizará un análisis completo del sitio web, identificación de palabras clave objetivo, y desarrollo de una estrategia de optimización personalizada.",
      order: 3
    },
    {
      title: "Cuota mensual",
      content: "Los servicios mensuales incluyen: actualización de contenidos, monitoreo de posiciones, análisis de competidores, y reportes de rendimiento.",
      order: 4
    },
    {
      title: "Forma de pago",
      content: "El pago se realizará mediante transferencia bancaria. La primera fase se abonará al inicio del contrato, mientras que la cuota mensual se abonará en los primeros 5 días de cada mes.",
      order: 5
    },
    {
      title: "Duración del contrato",
      content: "El presente contrato tendrá una duración inicial de 6 meses, renovable automáticamente por períodos iguales salvo notificación contraria por cualquiera de las partes con al menos 30 días de antelación.",
      order: 6
    },
    {
      title: "Confidencialidad",
      content: "Ambas partes se comprometen a mantener la confidencialidad sobre la información intercambiada durante la prestación de los servicios.",
      order: 7
    },
    {
      title: "Responsabilidades",
      content: "El profesional se compromete a aplicar las mejores prácticas de SEO para mejorar el posicionamiento del sitio web. Sin embargo, debido a la naturaleza cambiante de los algoritmos de los motores de búsqueda, no puede garantizar posiciones específicas para determinadas palabras clave.",
      order: 8
    },
  ];
};
