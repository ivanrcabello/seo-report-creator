
/**
 * PDF styling utilities for invoice generation
 */

/**
 * Maps invoice status to display text
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case "paid":
      return "PAGADA";
    case "pending":
      return "PENDIENTE";
    case "cancelled":
      return "CANCELADA";
    default:
      return "PENDIENTE";
  }
};

/**
 * Maps invoice status to color
 */
export const getStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case "paid":
      return [34, 197, 94]; // Green
    case "pending":
      return [234, 179, 8]; // Yellow
    case "cancelled":
      return [239, 68, 68]; // Red
    default:
      return [107, 114, 128]; // Gray
  }
};

/**
 * Text styles for PDF documents
 */
export const textStyles = {
  header: {
    font: "helvetica",
    style: "bold",
    size: 18,
    color: [59, 130, 246] // Blue (primary color)
  },
  subheader: {
    font: "helvetica",
    style: "bold",
    size: 12,
    color: [75, 85, 99] // Gray-600
  },
  default: {
    font: "helvetica",
    style: "normal",
    size: 10,
    color: [31, 41, 55] // Gray-800
  }
};

/**
 * Table styles for PDF documents
 */
export const tableStyles = {
  styles: {
    fontSize: 10,
    cellPadding: 5
  },
  headStyles: {
    fillColor: [241, 245, 249], // Gray-100
    textColor: [31, 41, 55],    // Gray-800
    fontStyle: "bold"
  },
  bodyStyles: {
    textColor: [31, 41, 55]     // Gray-800
  },
  alternateRowStyles: {
    fillColor: [249, 250, 251]  // Gray-50
  }
};

// Añadimos estas funciones que se estaban importando en pdfGenerator.ts
export const getBaseStyles = () => {
  return {
    text: textStyles,
    table: tableStyles
  };
};

export const getPDFColors = (companySettings: any) => {
  // Si hay colores personalizados en la configuración de la empresa, los usamos
  // Si no, usamos colores predeterminados
  return {
    primary: companySettings.primaryColor ? hexToRgb(companySettings.primaryColor) : [59, 130, 246],
    secondary: companySettings.secondaryColor ? hexToRgb(companySettings.secondaryColor) : [75, 85, 99],
    accent: companySettings.accentColor ? hexToRgb(companySettings.accentColor) : [16, 185, 129]
  };
};

// Función auxiliar para convertir colores hexadecimales a RGB
const hexToRgb = (hex: string): [number, number, number] => {
  // Eliminar # si está presente
  hex = hex.replace(/^#/, '');
  
  // Parsear componentes
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return [r, g, b];
};
