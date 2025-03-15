
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
export const getStatusColor = (status: string): { r: number, g: number, b: number } => {
  switch (status) {
    case "paid":
      return { r: 34, g: 197, b: 94 }; // Green
    case "pending":
      return { r: 234, g: 179, b: 8 }; // Yellow
    case "cancelled":
      return { r: 239, g: 68, b: 68 }; // Red
    default:
      return { r: 107, g: 114, b: 128 }; // Gray
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
    color: { r: 59, g: 130, b: 246 } // Blue (primary color)
  },
  subheader: {
    font: "helvetica",
    style: "bold",
    size: 12,
    color: { r: 75, g: 85, b: 99 } // Gray-600
  },
  default: {
    font: "helvetica",
    style: "normal",
    size: 10,
    color: { r: 31, g: 41, b: 55 } // Gray-800
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

// Add TypeScript declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    } | undefined;
  }
}
